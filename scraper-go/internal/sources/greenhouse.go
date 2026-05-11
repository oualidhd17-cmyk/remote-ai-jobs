package sources

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"remote-ai-jobs/scraper-go/internal/fetcher"
	"remote-ai-jobs/scraper-go/internal/models"
	"remote-ai-jobs/scraper-go/internal/normalizer"
)

type GreenhouseSource struct {
	client *fetcher.Client
	limit  int
	boards []string
}

type greenhouseResponse struct {
	Jobs []greenhouseJob `json:"jobs"`
}

type greenhouseJob struct {
	ID          int                        `json:"id"`
	Title       string                     `json:"title"`
	AbsoluteURL string                     `json:"absolute_url"`
	Location    greenhouseLocation         `json:"location"`
	UpdatedAt   string                     `json:"updated_at"`
	Content     string                     `json:"content"`
	Departments []greenhouseDepartment     `json:"departments"`
	Offices     []greenhouseOffice         `json:"offices"`
	Metadata    []greenhouseMetadata       `json:"metadata"`
	Questions   []map[string]interface{}   `json:"questions"`
	Data        map[string]json.RawMessage `json:"-"`
}

type greenhouseLocation struct {
	Name string `json:"name"`
}

type greenhouseDepartment struct {
	Name string `json:"name"`
}

type greenhouseOffice struct {
	Name string `json:"name"`
}

type greenhouseMetadata struct {
	Name  string      `json:"name"`
	Value interface{} `json:"value"`
}

func NewGreenhouseSource(client *fetcher.Client, limit int, boards []string) *GreenhouseSource {
	return &GreenhouseSource{
		client: client,
		limit:  limit,
		boards: boards,
	}
}

func (s *GreenhouseSource) Name() string {
	return "greenhouse"
}

func (s *GreenhouseSource) Fetch(ctx context.Context) ([]models.RawJob, error) {
	allJobs := make([]models.RawJob, 0)

	for _, board := range s.boards {
		board = strings.TrimSpace(board)
		if board == "" {
			continue
		}

		if s.limit > 0 && len(allJobs) >= s.limit {
			break
		}

		jobs, err := s.fetchBoard(ctx, board)
		if err != nil {
			fmt.Printf("Greenhouse board skipped: %s error: %v\n", board, err)
			continue
		}

		for _, job := range jobs {
			if s.limit > 0 && len(allJobs) >= s.limit {
				break
			}

			allJobs = append(allJobs, job)
		}

		time.Sleep(1 * time.Second)
	}

	return allJobs, nil
}

func (s *GreenhouseSource) fetchBoard(ctx context.Context, board string) ([]models.RawJob, error) {
	url := fmt.Sprintf(
		"https://boards-api.greenhouse.io/v1/boards/%s/jobs?content=true",
		board,
	)

	body, err := s.client.Get(ctx, url)
	if err != nil {
		return nil, err
	}

	var response greenhouseResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return nil, fmt.Errorf("greenhouse json parse failed for board %s: %w", board, err)
	}

	jobs := make([]models.RawJob, 0)

	for _, item := range response.Jobs {
		title := normalizer.CleanText(item.Title)
		company := normalizer.CleanText(board)
		location := normalizer.CleanText(item.Location.Name)
		description := normalizer.CleanText(item.Content)

		if title == "" {
			continue
		}

		tags := make([]string, 0)

		for _, department := range item.Departments {
			if department.Name != "" {
				tags = append(tags, department.Name)
			}
		}

		for _, office := range item.Offices {
			if office.Name != "" {
				tags = append(tags, office.Name)
			}
		}

		job := models.RawJob{
			Source:      s.Name(),
			ExternalID:  fmt.Sprintf("%s-%d", board, item.ID),
			Title:       title,
			Company:     company,
			Location:    location,
			Country:     normalizer.NormalizeCountry(location),
			Description: description,
			ApplyURL:    item.AbsoluteURL,
			Salary:      extractGreenhouseSalary(item),
			Tags:        normalizer.NormalizeTags(tags),
			PublishedAt: normalizeDate(item.UpdatedAt),
			SourceURL:   item.AbsoluteURL,
			RawPayload: map[string]interface{}{
				"board":        board,
				"id":           item.ID,
				"title":        item.Title,
				"absolute_url": item.AbsoluteURL,
				"location":     item.Location,
				"updated_at":   item.UpdatedAt,
				"departments":  item.Departments,
				"offices":      item.Offices,
				"metadata":     item.Metadata,
			},
		}

		jobs = append(jobs, job)
	}

	return jobs, nil
}

func extractGreenhouseSalary(item greenhouseJob) string {
	for _, metadata := range item.Metadata {
		name := strings.ToLower(metadata.Name)

		if strings.Contains(name, "salary") ||
			strings.Contains(name, "compensation") ||
			strings.Contains(name, "pay") {
			if metadata.Value == nil {
				continue
			}

			return normalizer.CleanText(fmt.Sprintf("%v", metadata.Value))
		}
	}

	return ""
}

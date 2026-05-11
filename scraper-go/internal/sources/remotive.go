package sources

import (
	"context"
	"encoding/json"
	"fmt"

	"remote-ai-jobs/scraper-go/internal/fetcher"
	"remote-ai-jobs/scraper-go/internal/models"
	"remote-ai-jobs/scraper-go/internal/normalizer"
)

const remotiveURL = "https://remotive.com/api/remote-jobs?category=software-dev"

type RemotiveSource struct {
	client *fetcher.Client
	limit  int
}

type remotiveResponse struct {
	Jobs []remotiveJob `json:"jobs"`
}

type remotiveJob struct {
	ID                        int      `json:"id"`
	URL                       string   `json:"url"`
	Title                     string   `json:"title"`
	CompanyName               string   `json:"company_name"`
	CompanyLogo               string   `json:"company_logo"`
	Category                  string   `json:"category"`
	Tags                      []string `json:"tags"`
	JobType                   string   `json:"job_type"`
	PublicationDate           string   `json:"publication_date"`
	CandidateRequiredLocation string   `json:"candidate_required_location"`
	Salary                    string   `json:"salary"`
	Description               string   `json:"description"`
}

func NewRemotiveSource(client *fetcher.Client, limit int) *RemotiveSource {
	return &RemotiveSource{
		client: client,
		limit:  limit,
	}
}

func (s *RemotiveSource) Name() string {
	return "remotive"
}

func (s *RemotiveSource) Fetch(ctx context.Context) ([]models.RawJob, error) {
	body, err := s.client.Get(ctx, remotiveURL)
	if err != nil {
		return nil, err
	}

	var response remotiveResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return nil, fmt.Errorf("remotive json parse failed: %w", err)
	}

	jobs := make([]models.RawJob, 0)

	for _, item := range response.Jobs {
		if s.limit > 0 && len(jobs) >= s.limit {
			break
		}

		title := normalizer.CleanText(item.Title)
		company := normalizer.CleanText(item.CompanyName)
		description := normalizer.CleanText(item.Description)
		location := normalizer.CleanText(item.CandidateRequiredLocation)

		if title == "" || company == "" {
			continue
		}

		tags := append([]string{}, item.Tags...)
		if item.Category != "" {
			tags = append(tags, item.Category)
		}
		if item.JobType != "" {
			tags = append(tags, item.JobType)
		}

		rawPayload := map[string]interface{}{
			"id":                          item.ID,
			"url":                         item.URL,
			"title":                       item.Title,
			"company_name":                item.CompanyName,
			"company_logo":                item.CompanyLogo,
			"category":                    item.Category,
			"tags":                        item.Tags,
			"job_type":                    item.JobType,
			"publication_date":            item.PublicationDate,
			"candidate_required_location": item.CandidateRequiredLocation,
			"salary":                      item.Salary,
			"description":                 item.Description,
		}

		job := models.RawJob{
			Source:      s.Name(),
			ExternalID:  fmt.Sprintf("%d", item.ID),
			Title:       title,
			Company:     company,
			Location:    location,
			Country:     normalizer.NormalizeCountry(location),
			Description: description,
			ApplyURL:    item.URL,
			Salary:      normalizer.CleanText(item.Salary),
			Tags:        normalizer.NormalizeTags(tags),
			PublishedAt: normalizeDate(item.PublicationDate),
			SourceURL:   item.URL,
			RawPayload:  rawPayload,
		}

		jobs = append(jobs, job)
	}

	return jobs, nil
}

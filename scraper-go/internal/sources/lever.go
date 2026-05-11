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

type LeverSource struct {
	client    *fetcher.Client
	limit     int
	companies []string
}

type leverPosting struct {
	ID               string                 `json:"id"`
	Text             string                 `json:"text"`
	Categories       leverCategories        `json:"categories"`
	AdditionalPlain  string                 `json:"additionalPlain"`
	DescriptionPlain string                 `json:"descriptionPlain"`
	Description      string                 `json:"description"`
	Additional       string                 `json:"additional"`
	HostedURL        string                 `json:"hostedUrl"`
	ApplyURL         string                 `json:"applyUrl"`
	CreatedAt        int64                  `json:"createdAt"`
	Lists            []leverList            `json:"lists"`
	WorkplaceType    string                 `json:"workplaceType"`
	Commitment       string                 `json:"commitment"`
	RawPayload       map[string]interface{} `json:"-"`
}

type leverCategories struct {
	Team       string `json:"team"`
	Department string `json:"department"`
	Location   string `json:"location"`
	Commitment string `json:"commitment"`
}

type leverList struct {
	Text    string `json:"text"`
	Content string `json:"content"`
}

func NewLeverSource(client *fetcher.Client, limit int, companies []string) *LeverSource {
	return &LeverSource{
		client:    client,
		limit:     limit,
		companies: companies,
	}
}

func (s *LeverSource) Name() string {
	return "lever"
}

func (s *LeverSource) Fetch(ctx context.Context) ([]models.RawJob, error) {
	allJobs := make([]models.RawJob, 0)

	for _, company := range s.companies {
		company = strings.TrimSpace(company)
		if company == "" {
			continue
		}

		if s.limit > 0 && len(allJobs) >= s.limit {
			break
		}

		jobs, err := s.fetchCompany(ctx, company)
		if err != nil {
			fmt.Printf("Lever company skipped: %s error: %v\n", company, err)
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

func (s *LeverSource) fetchCompany(ctx context.Context, company string) ([]models.RawJob, error) {
	url := fmt.Sprintf(
		"https://api.lever.co/v0/postings/%s?mode=json",
		company,
	)

	body, err := s.client.Get(ctx, url)
	if err != nil {
		return nil, err
	}

	var postings []leverPosting
	if err := json.Unmarshal(body, &postings); err != nil {
		return nil, fmt.Errorf("lever json parse failed for company %s: %w", company, err)
	}

	jobs := make([]models.RawJob, 0)

	for _, item := range postings {
		title := normalizer.CleanText(item.Text)
		location := normalizer.CleanText(item.Categories.Location)
		description := buildLeverDescription(item)

		if title == "" {
			continue
		}

		tags := []string{
			item.Categories.Team,
			item.Categories.Department,
			item.Categories.Commitment,
			item.WorkplaceType,
			item.Commitment,
		}

		sourceURL := item.HostedURL
		applyURL := item.ApplyURL

		if applyURL == "" {
			applyURL = sourceURL
		}

		job := models.RawJob{
			Source:      s.Name(),
			ExternalID:  fmt.Sprintf("%s-%s", company, item.ID),
			Title:       title,
			Company:     normalizer.CleanText(company),
			Location:    location,
			Country:     normalizer.NormalizeCountry(location),
			Description: description,
			ApplyURL:    applyURL,
			Salary:      extractLeverSalary(item),
			Tags:        normalizer.NormalizeTags(tags),
			PublishedAt: leverDate(item.CreatedAt),
			SourceURL:   sourceURL,
			RawPayload: map[string]interface{}{
				"company":          company,
				"id":               item.ID,
				"text":             item.Text,
				"categories":       item.Categories,
				"hostedUrl":        item.HostedURL,
				"applyUrl":         item.ApplyURL,
				"createdAt":        item.CreatedAt,
				"workplaceType":    item.WorkplaceType,
				"commitment":       item.Commitment,
				"descriptionPlain": item.DescriptionPlain,
				"additionalPlain":  item.AdditionalPlain,
			},
		}

		jobs = append(jobs, job)
	}

	return jobs, nil
}

func buildLeverDescription(item leverPosting) string {
	parts := []string{
		item.DescriptionPlain,
		item.AdditionalPlain,
	}

	for _, list := range item.Lists {
		if list.Text != "" {
			parts = append(parts, list.Text)
		}

		if list.Content != "" {
			parts = append(parts, list.Content)
		}
	}

	description := strings.Join(parts, " ")
	description = normalizer.CleanText(description)

	if description != "" {
		return description
	}

	fallback := strings.Join([]string{
		item.Description,
		item.Additional,
	}, " ")

	return normalizer.CleanText(fallback)
}

func extractLeverSalary(item leverPosting) string {
	text := strings.ToLower(buildLeverDescription(item))

	keywords := []string{
		"$",
		"salary",
		"compensation",
		"base pay",
		"pay range",
		"usd",
		"eur",
		"gbp",
	}

	for _, keyword := range keywords {
		if strings.Contains(text, keyword) {
			return normalizer.CleanText(text)
		}
	}

	return ""
}

func leverDate(milliseconds int64) string {
	if milliseconds <= 0 {
		return time.Now().UTC().Format("2006-01-02")
	}

	seconds := milliseconds / 1000
	return time.Unix(seconds, 0).UTC().Format("2006-01-02")
}

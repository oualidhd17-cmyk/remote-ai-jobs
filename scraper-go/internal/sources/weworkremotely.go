package sources

import (
	"context"
	"encoding/xml"
	"fmt"
	"strings"

	"remote-ai-jobs/scraper-go/internal/fetcher"
	"remote-ai-jobs/scraper-go/internal/models"
	"remote-ai-jobs/scraper-go/internal/normalizer"
)

const weWorkRemotelyRSSURL = "https://weworkremotely.com/remote-jobs.rss"

type WeWorkRemotelySource struct {
	client *fetcher.Client
	limit  int
}

type weWorkRemotelyRSS struct {
	Channel weWorkRemotelyChannel `xml:"channel"`
}

type weWorkRemotelyChannel struct {
	Items []weWorkRemotelyItem `xml:"item"`
}

type weWorkRemotelyItem struct {
	Title       string   `xml:"title"`
	Link        string   `xml:"link"`
	GUID        string   `xml:"guid"`
	Description string   `xml:"description"`
	PubDate     string   `xml:"pubDate"`
	Categories  []string `xml:"category"`
}

func NewWeWorkRemotelySource(client *fetcher.Client, limit int) *WeWorkRemotelySource {
	return &WeWorkRemotelySource{
		client: client,
		limit:  limit,
	}
}

func (s *WeWorkRemotelySource) Name() string {
	return "weworkremotely"
}

func (s *WeWorkRemotelySource) Fetch(ctx context.Context) ([]models.RawJob, error) {
	body, err := s.client.Get(ctx, weWorkRemotelyRSSURL)
	if err != nil {
		return nil, err
	}

	var feed weWorkRemotelyRSS
	if err := xml.Unmarshal(body, &feed); err != nil {
		return nil, fmt.Errorf("weworkremotely rss parse failed: %w", err)
	}

	jobs := make([]models.RawJob, 0)

	for _, item := range feed.Channel.Items {
		if s.limit > 0 && len(jobs) >= s.limit {
			break
		}

		title, company := parseWeWorkRemotelyTitle(item.Title)

		title = normalizer.CleanText(title)
		company = normalizer.CleanText(company)

		if title == "" {
			continue
		}

		if company == "" {
			company = "Unknown Company"
		}

		link := normalizer.CleanText(item.Link)
		externalID := normalizer.CleanText(item.GUID)

		if externalID == "" {
			externalID = link
		}

		location := "Remote"
		description := normalizer.CleanText(item.Description)

		tags := append([]string{}, item.Categories...)
		tags = append(tags, "Remote")

		job := models.RawJob{
			Source:      s.Name(),
			ExternalID:  externalID,
			Title:       title,
			Company:     company,
			Location:    location,
			Country:     normalizer.NormalizeCountry(location),
			Description: description,
			ApplyURL:    link,
			Salary:      "",
			Tags:        normalizer.NormalizeTags(tags),
			PublishedAt: normalizeDate(item.PubDate),
			SourceURL:   link,
			RawPayload: map[string]interface{}{
				"title":       item.Title,
				"link":        item.Link,
				"guid":        item.GUID,
				"description": item.Description,
				"pub_date":    item.PubDate,
				"categories":  item.Categories,
			},
		}

		jobs = append(jobs, job)
	}

	return jobs, nil
}

func parseWeWorkRemotelyTitle(value string) (string, string) {
	clean := strings.TrimSpace(value)

	if strings.Contains(clean, ":") {
		parts := strings.SplitN(clean, ":", 2)
		company := strings.TrimSpace(parts[0])
		title := strings.TrimSpace(parts[1])

		return title, company
	}

	if strings.Contains(strings.ToLower(clean), " at ") {
		parts := strings.SplitN(clean, " at ", 2)
		title := strings.TrimSpace(parts[0])
		company := strings.TrimSpace(parts[1])

		return title, company
	}

	return clean, ""
}

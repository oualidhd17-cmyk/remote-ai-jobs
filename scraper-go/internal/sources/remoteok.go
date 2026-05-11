package sources

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"remote-ai-jobs/scraper-go/internal/fetcher"
	"remote-ai-jobs/scraper-go/internal/models"
	"remote-ai-jobs/scraper-go/internal/normalizer"
)

const remoteOKURL = "https://remoteok.com/api"

type RemoteOKSource struct {
	client *fetcher.Client
	limit  int
}

func NewRemoteOKSource(client *fetcher.Client, limit int) *RemoteOKSource {
	return &RemoteOKSource{
		client: client,
		limit:  limit,
	}
}

func (s *RemoteOKSource) Name() string {
	return "remoteok"
}

func (s *RemoteOKSource) Fetch(ctx context.Context) ([]models.RawJob, error) {
	body, err := s.client.Get(ctx, remoteOKURL)
	if err != nil {
		return nil, err
	}

	var rows []map[string]interface{}
	if err := json.Unmarshal(body, &rows); err != nil {
		return nil, fmt.Errorf("remoteok json parse failed: %w", err)
	}

	jobs := make([]models.RawJob, 0)

	for index, row := range rows {
		if index == 0 {
			continue
		}

		if s.limit > 0 && len(jobs) >= s.limit {
			break
		}

		title := normalizer.CleanText(getString(row, "position"))
		company := normalizer.CleanText(getString(row, "company"))
		description := normalizer.CleanText(getString(row, "description"))
		location := normalizer.CleanText(getString(row, "location"))

		if title == "" || company == "" {
			continue
		}

		id := getExternalID(row)
		sourceURL := "https://remoteok.com/remote-jobs/" + id
		applyURL := getString(row, "apply_url")
		if applyURL == "" {
			applyURL = sourceURL
		}

		publishedAt := normalizeDate(getString(row, "date"))

		tags := extractRemoteOKTags(row)

		job := models.RawJob{
			Source:      s.Name(),
			ExternalID:  id,
			Title:       title,
			Company:     company,
			Location:    location,
			Country:     normalizer.NormalizeCountry(location),
			Description: description,
			ApplyURL:    applyURL,
			Salary:      extractRemoteOKSalary(row),
			Tags:        normalizer.NormalizeTags(tags),
			PublishedAt: publishedAt,
			SourceURL:   sourceURL,
			RawPayload:  row,
		}

		jobs = append(jobs, job)
	}

	return jobs, nil
}

func extractRemoteOKTags(row map[string]interface{}) []string {
	tags := make([]string, 0)

	if rawTags, ok := row["tags"].([]interface{}); ok {
		for _, item := range rawTags {
			if value, ok := item.(string); ok {
				tags = append(tags, value)
			}
		}
	}

	if rawTags, ok := row["tags"].([]string); ok {
		tags = append(tags, rawTags...)
	}

	return tags
}

func extractRemoteOKSalary(row map[string]interface{}) string {
	min := getNumber(row, "salary_min")
	max := getNumber(row, "salary_max")

	if min > 0 && max > 0 {
		return fmt.Sprintf("$%d - $%d", min, max)
	}

	if min > 0 {
		return fmt.Sprintf("$%d+", min)
	}

	if max > 0 {
		return fmt.Sprintf("Up to $%d", max)
	}

	return ""
}

func getExternalID(row map[string]interface{}) string {
	if value := getString(row, "id"); value != "" {
		return value
	}

	if value := getString(row, "slug"); value != "" {
		return value
	}

	if number := getNumber(row, "id"); number > 0 {
		return strconv.Itoa(number)
	}

	return strconv.FormatInt(time.Now().UnixNano(), 10)
}

func getString(row map[string]interface{}, key string) string {
	value, ok := row[key]
	if !ok || value == nil {
		return ""
	}

	switch typed := value.(type) {
	case string:
		return strings.TrimSpace(typed)
	case float64:
		return strconv.FormatInt(int64(typed), 10)
	case int:
		return strconv.Itoa(typed)
	default:
		return ""
	}
}

func getNumber(row map[string]interface{}, key string) int {
	value, ok := row[key]
	if !ok || value == nil {
		return 0
	}

	switch typed := value.(type) {
	case float64:
		return int(typed)
	case int:
		return typed
	case string:
		parsed, _ := strconv.Atoi(typed)
		return parsed
	default:
		return 0
	}
}

func normalizeDate(value string) string {
	value = strings.TrimSpace(value)
	if value == "" {
		return time.Now().UTC().Format("2006-01-02")
	}

	layouts := []string{
		time.RFC3339,
		"2006-01-02",
		"2006-01-02T15:04:05-07:00",
		"Mon, 02 Jan 2006 15:04:05 MST",
	}

	for _, layout := range layouts {
		parsed, err := time.Parse(layout, value)
		if err == nil {
			return parsed.UTC().Format("2006-01-02")
		}
	}

	if len(value) >= 10 {
		return value[:10]
	}

	return time.Now().UTC().Format("2006-01-02")
}

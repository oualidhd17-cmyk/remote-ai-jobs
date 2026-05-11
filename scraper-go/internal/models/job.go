package models

import "time"

type RawJob struct {
	Source      string                 `json:"source"`
	ExternalID  string                 `json:"external_id"`
	Title       string                 `json:"title"`
	Company     string                 `json:"company"`
	Location    string                 `json:"location"`
	Country     string                 `json:"country"`
	Description string                 `json:"description"`
	ApplyURL    string                 `json:"apply_url"`
	Salary      string                 `json:"salary"`
	Tags        []string               `json:"tags"`
	PublishedAt string                 `json:"published_at"`
	SourceURL   string                 `json:"source_url"`
	RawPayload  map[string]interface{} `json:"raw_payload"`
}

type ScrapeResult struct {
	Source    string    `json:"source"`
	Jobs      []RawJob  `json:"jobs"`
	Count     int       `json:"count"`
	FetchedAt time.Time `json:"fetched_at"`
	Error     string    `json:"error,omitempty"`
}

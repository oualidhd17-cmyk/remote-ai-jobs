package writer

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"remote-ai-jobs/scraper-go/internal/models"
)

type OutputFile struct {
	GeneratedAt string          `json:"generated_at"`
	Count       int             `json:"count"`
	Jobs        []models.RawJob `json:"jobs"`
}

func WriteRawJobs(path string, generatedAt string, jobs []models.RawJob) error {
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		return fmt.Errorf("create output directory failed: %w", err)
	}

	output := OutputFile{
		GeneratedAt: generatedAt,
		Count:       len(jobs),
		Jobs:        jobs,
	}

	data, err := json.MarshalIndent(output, "", "  ")
	if err != nil {
		return fmt.Errorf("marshal raw jobs failed: %w", err)
	}

	if err := os.WriteFile(path, data, 0644); err != nil {
		return fmt.Errorf("write raw jobs file failed: %w", err)
	}

	return nil
}

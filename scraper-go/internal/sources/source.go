package sources

import (
	"context"

	"remote-ai-jobs/scraper-go/internal/models"
)

type Source interface {
	Name() string
	Fetch(ctx context.Context) ([]models.RawJob, error)
}

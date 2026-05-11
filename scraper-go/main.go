package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"remote-ai-jobs/scraper-go/internal/config"
	"remote-ai-jobs/scraper-go/internal/fetcher"
	"remote-ai-jobs/scraper-go/internal/models"
	"remote-ai-jobs/scraper-go/internal/sources"
	"remote-ai-jobs/scraper-go/internal/writer"
)

func main() {
	cfg := config.DefaultConfig()

	ctx, cancel := context.WithTimeout(context.Background(), 6*time.Minute)
	defer cancel()

	client := fetcher.NewClient(cfg.RequestTimeout, cfg.UserAgent)

	jobSources := []sources.Source{
		sources.NewRemoteOKSource(client, cfg.MaxJobsPerFeed),
		sources.NewRemotiveSource(client, cfg.MaxJobsPerFeed),
		sources.NewWeWorkRemotelySource(client, cfg.MaxJobsPerFeed),
		sources.NewGreenhouseSource(client, cfg.MaxJobsPerFeed, cfg.GreenhouseBoards),
		sources.NewLeverSource(client, cfg.MaxJobsPerFeed, cfg.LeverCompanies),
	}

	allJobs := make([]models.RawJob, 0)

	fmt.Println("Starting Remote AI Jobs Scraper...")

	for _, source := range jobSources {
		fmt.Printf("Fetching source: %s\n", source.Name())

		jobs, err := source.Fetch(ctx)
		if err != nil {
			log.Printf("source failed: %s error: %v\n", source.Name(), err)
			continue
		}

		fmt.Printf("Fetched %d jobs from %s\n", len(jobs), source.Name())
		allJobs = append(allJobs, jobs...)

		time.Sleep(2 * time.Second)
	}

	generatedAt := time.Now().UTC().Format(time.RFC3339)

	if err := writer.WriteRawJobs(cfg.OutputPath, generatedAt, allJobs); err != nil {
		log.Fatalf("failed writing raw jobs: %v", err)
	}

	fmt.Println("Done.")
	fmt.Printf("Total raw jobs: %d\n", len(allJobs))
	fmt.Printf("Output: %s\n", cfg.OutputPath)
}

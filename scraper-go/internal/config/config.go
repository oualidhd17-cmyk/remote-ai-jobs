package config

import "time"

type Config struct {
	RequestTimeout time.Duration
	UserAgent      string
	OutputPath     string
	MaxJobsPerFeed int

	GreenhouseBoards []string
	LeverCompanies   []string
}

func DefaultConfig() Config {
	return Config{
		RequestTimeout: 30 * time.Second,
		UserAgent:      "RemoteAIJobsBot/1.0 (+https://remote-ai-jobs.pages.dev)",
		OutputPath:     "output/raw_jobs.json",
		MaxJobsPerFeed: 80,

		GreenhouseBoards: []string{
			"openai",
			"anthropic",
			"scaleai",
			"databricks",
			"cohere",
			"replicate",
			"weightsbiases",
			"huggingface",
		},

		LeverCompanies: []string{
			"perplexityai",
			"elevenlabs",
			"wandb",
			"cursor",
			"replit",
			"zapier",
			"automattic",
		},
	}
}

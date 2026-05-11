package fetcher

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"time"
)

type Client struct {
	httpClient *http.Client
	userAgent  string
}

func NewClient(timeout time.Duration, userAgent string) *Client {
	return &Client{
		httpClient: &http.Client{
			Timeout: timeout,
		},
		userAgent: userAgent,
	}
}

func (c *Client) Get(ctx context.Context, url string) ([]byte, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, fmt.Errorf("create request failed: %w", err)
	}

	req.Header.Set("User-Agent", c.userAgent)
	req.Header.Set("Accept", "application/json,text/plain,*/*")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("http get failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("bad response status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("read body failed: %w", err)
	}

	return body, nil
}

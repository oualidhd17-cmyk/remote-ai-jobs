package normalizer

import (
	"regexp"
	"strings"
)

var htmlTagRegex = regexp.MustCompile(`<[^>]*>`)
var spacesRegex = regexp.MustCompile(`\s+`)

func CleanText(value string) string {
	value = strings.TrimSpace(value)
	value = htmlTagRegex.ReplaceAllString(value, " ")
	value = strings.ReplaceAll(value, "&nbsp;", " ")
	value = strings.ReplaceAll(value, "&amp;", "&")
	value = strings.ReplaceAll(value, "&lt;", "<")
	value = strings.ReplaceAll(value, "&gt;", ">")
	value = spacesRegex.ReplaceAllString(value, " ")
	return strings.TrimSpace(value)
}

func NormalizeCountry(location string) string {
	lower := strings.ToLower(location)

	switch {
	case strings.Contains(lower, "united states"),
		strings.Contains(lower, "usa"),
		strings.Contains(lower, "us only"),
		strings.Contains(lower, "u.s."):
		return "USA"

	case strings.Contains(lower, "canada"):
		return "Canada"

	case strings.Contains(lower, "germany"),
		strings.Contains(lower, "deutschland"):
		return "Germany"

	case strings.Contains(lower, "united kingdom"),
		strings.Contains(lower, "uk"),
		strings.Contains(lower, "england"),
		strings.Contains(lower, "london"):
		return "UK"

	case strings.Contains(lower, "australia"):
		return "Australia"

	case strings.Contains(lower, "netherlands"):
		return "Netherlands"

	case strings.Contains(lower, "switzerland"):
		return "Switzerland"

	case strings.Contains(lower, "united arab emirates"),
		strings.Contains(lower, "uae"),
		strings.Contains(lower, "dubai"),
		strings.Contains(lower, "abu dhabi"):
		return "UAE"

	case strings.Contains(lower, "ireland"):
		return "Ireland"

	case strings.Contains(lower, "singapore"):
		return "Singapore"

	case strings.Contains(lower, "worldwide"),
		strings.Contains(lower, "anywhere"),
		strings.Contains(lower, "global"),
		strings.Contains(lower, "remote"):
		return "Worldwide"

	default:
		return ""
	}
}

func NormalizeTags(tags []string) []string {
	seen := map[string]bool{}
	result := make([]string, 0)

	for _, tag := range tags {
		clean := CleanText(tag)
		if clean == "" {
			continue
		}

		key := strings.ToLower(clean)
		if seen[key] {
			continue
		}

		seen[key] = true
		result = append(result, clean)
	}

	return result
}

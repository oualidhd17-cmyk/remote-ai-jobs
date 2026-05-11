from __future__ import annotations

from typing import Any

from utils import clean_text, is_older_than, normalize_url


def calculate_quality_score(job: dict[str, Any], is_duplicate: bool = False) -> int:
    score = 0

    if job.get("remote_type") == "remote":
        score += 20

    if job.get("salary_min") or job.get("salary_max"):
        score += 15

    company = job.get("company", {})

    if isinstance(company, dict) and clean_text(company.get("name", "")):
        score += 15

    if normalize_url(job.get("apply_url", "")):
        score += 10

    if not is_older_than(job.get("published_at", ""), 14):
        score += 10

    if clean_text(job.get("category", "")):
        score += 10

    if job.get("skills"):
        score += 10

    if clean_text(job.get("country", "")):
        score += 10

    if job.get("visa_sponsorship") is True:
        score += 10

    description = clean_text(job.get("description_summary", ""))

    if len(description) < 80:
        score -= 30

    if not normalize_url(job.get("apply_url", "")):
        score -= 40

    if is_duplicate:
        score -= 50

    if is_older_than(job.get("published_at", ""), 45):
        score -= 100

    return max(0, min(100, score))


def resolve_status(score: int, is_duplicate: bool = False, expired: bool = False) -> str:
    if expired:
        return "expired"

    if is_duplicate:
        return "duplicate"

    if score >= 70:
        return "published"

    if score >= 40:
        return "pending"

    return "rejected"
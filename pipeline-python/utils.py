from __future__ import annotations

import hashlib
import html
import json
import re
import unicodedata
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
RAW_JOBS_PATH = ROOT / "scraper-go" / "output" / "raw_jobs.json"
OUTPUT_DIR = ROOT / "pipeline-python" / "output"

SITE_URL = "https://remote-ai-jobs.pages.dev"

HTML_TAG_RE = re.compile(r"<[^>]+>")
SPACE_RE = re.compile(r"\s+")
SLUG_RE = re.compile(r"[^a-z0-9]+")


def ensure_output_dir() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def read_json(path: Path) -> Any:
    if not path.exists():
        raise FileNotFoundError(f"JSON file not found: {path}")

    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: Any) -> None:
    ensure_output_dir()
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def clean_text(value: Any) -> str:
    if value is None:
        return ""

    text = str(value)
    text = html.unescape(text)
    text = HTML_TAG_RE.sub(" ", text)
    text = text.replace("\u00a0", " ")
    text = SPACE_RE.sub(" ", text)
    return text.strip()


def compact_summary(value: str, limit: int = 240) -> str:
    text = clean_text(value)

    if len(text) <= limit:
        return text

    sliced = text[:limit].rsplit(" ", 1)[0].strip()

    if not sliced:
        return text[:limit]

    return f"{sliced}..."


def slugify(value: str, fallback: str = "item") -> str:
    text = unicodedata.normalize("NFKD", value)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = text.lower().strip()
    text = SLUG_RE.sub("-", text)
    text = text.strip("-")
    return text or fallback


def stable_hash(*parts: str, length: int = 12) -> str:
    raw = "|".join([p or "" for p in parts])
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()[:length]


def parse_date(value: Any) -> str:
    text = clean_text(value)

    if not text:
        return datetime.now(timezone.utc).date().isoformat()

    candidates = [
        "%Y-%m-%d",
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%d %H:%M:%S",
    ]

    for fmt in candidates:
        try:
            return datetime.strptime(text[:25], fmt).date().isoformat()
        except ValueError:
            pass

    if len(text) >= 10 and re.match(r"\d{4}-\d{2}-\d{2}", text[:10]):
        return text[:10]

    return datetime.now(timezone.utc).date().isoformat()


def is_older_than(date_text: str, days: int) -> bool:
    try:
        job_date = datetime.strptime(date_text, "%Y-%m-%d").date()
    except ValueError:
        return False

    limit = datetime.now(timezone.utc).date() - timedelta(days=days)
    return job_date < limit


def normalize_company_name(value: str) -> str:
    text = clean_text(value)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def normalize_title_for_dedupe(value: str) -> str:
    text = clean_text(value).lower()

    replacements = {
        "sr.": "senior",
        "sr ": "senior ",
        "jr.": "junior",
        "jr ": "junior ",
        "ml": "machine learning",
        "ai": "artificial intelligence",
    }

    for old, new in replacements.items():
        text = text.replace(old, new)

    remove_words = [
        "senior",
        "junior",
        "lead",
        "principal",
        "staff",
        "remote",
        "full-time",
        "full time",
        "contract",
    ]

    for word in remove_words:
        text = re.sub(rf"\b{re.escape(word)}\b", " ", text)

    text = SPACE_RE.sub(" ", text).strip()
    return slugify(text, "job")


def normalize_country(value: str, location: str = "") -> str:
    text = f"{value} {location}".lower()

    rules = [
        ("USA", ["usa", "united states", "u.s.", "us only", "america"]),
        ("Canada", ["canada"]),
        ("Germany", ["germany", "deutschland", "berlin", "munich"]),
        ("UK", ["uk", "united kingdom", "england", "london"]),
        ("Australia", ["australia", "sydney", "melbourne"]),
        ("Netherlands", ["netherlands", "amsterdam"]),
        ("Switzerland", ["switzerland", "zurich"]),
        ("UAE", ["uae", "united arab emirates", "dubai", "abu dhabi"]),
        ("Ireland", ["ireland", "dublin"]),
        ("Singapore", ["singapore"]),
        ("Worldwide", ["worldwide", "anywhere", "global", "remote"]),
    ]

    for country, keywords in rules:
        if any(keyword in text for keyword in keywords):
            return country

    return clean_text(value) or "Worldwide"


def normalize_url(value: str) -> str:
    url = clean_text(value)

    if not url:
        return ""

    parsed = urlparse(url)

    if parsed.scheme not in {"http", "https"}:
        return ""

    if not parsed.netloc:
        return ""

    return url


def extract_salary(value: str) -> tuple[int | None, int | None, str | None]:
    text = clean_text(value)

    if not text:
        return None, None, None

    currency = None

    if "$" in text or "usd" in text.lower():
        currency = "USD"
    elif "€" in text or "eur" in text.lower():
        currency = "EUR"
    elif "£" in text or "gbp" in text.lower():
        currency = "GBP"

    numbers = []

    for raw in re.findall(r"\d[\d,]{2,}", text):
        try:
            number = int(raw.replace(",", ""))

            if number < 1000:
                number *= 1000

            numbers.append(number)
        except ValueError:
            continue

    if not numbers:
        return None, None, currency

    if len(numbers) == 1:
        return numbers[0], None, currency

    return min(numbers), max(numbers), currency


def contains_any(text: str, keywords: list[str]) -> bool:
    lower = clean_text(text).lower()
    return any(keyword.lower() in lower for keyword in keywords)


def unique_list(values: list[str]) -> list[str]:
    seen = set()
    result = []

    for value in values:
        clean = clean_text(value)

        if not clean:
            continue

        key = clean.lower()

        if key in seen:
            continue

        seen.add(key)
        result.append(clean)

    return result


def safe_job_text(job: dict[str, Any]) -> str:
    tags = job.get("tags", []) or []

    if not isinstance(tags, list):
        tags = []

    parts = [
        job.get("title", ""),
        job.get("company", ""),
        job.get("location", ""),
        job.get("country", ""),
        job.get("description", ""),
        " ".join([str(tag) for tag in tags]),
    ]

    return clean_text(" ".join(map(str, parts)))
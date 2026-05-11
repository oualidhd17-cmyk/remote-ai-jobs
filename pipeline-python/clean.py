from __future__ import annotations

from collections import Counter
from typing import Any

from classify import (
    classify_category,
    detect_employment_type,
    detect_experience_level,
    detect_remote_type,
    detect_visa_sponsorship,
    extract_skills,
    is_ai_relevant,
)
from score import calculate_quality_score, resolve_status
from seo import (
    build_description_summary,
    build_job_slug,
    build_jobposting_schema,
    build_location_label,
    build_seo_description,
    build_seo_title,
)
from utils import (
    OUTPUT_DIR,
    RAW_JOBS_PATH,
    clean_text,
    extract_salary,
    is_older_than,
    normalize_company_name,
    normalize_country,
    normalize_title_for_dedupe,
    normalize_url,
    parse_date,
    read_json,
    slugify,
    stable_hash,
    write_json,
)


def load_raw_jobs() -> list[dict[str, Any]]:
    payload = read_json(RAW_JOBS_PATH)

    if isinstance(payload, dict):
        jobs = payload.get("jobs", [])

        if isinstance(jobs, list):
            return jobs

    if isinstance(payload, list):
        return payload

    return []


def dedupe_key(raw: dict[str, Any]) -> str:
    title = normalize_title_for_dedupe(raw.get("title", ""))
    company = slugify(normalize_company_name(raw.get("company", "")), "company")
    country = slugify(raw.get("country", "") or raw.get("location", ""), "country")
    apply_url = normalize_url(raw.get("apply_url", ""))
    external_id = clean_text(raw.get("external_id", ""))
    source = clean_text(raw.get("source", ""))

    if external_id and source:
        return f"external:{source}:{external_id}"

    if apply_url:
        return f"apply:{apply_url}"

    return f"title-company-country:{title}:{company}:{country}"


def transform_job(raw: dict[str, Any], is_duplicate: bool) -> dict[str, Any]:
    title = clean_text(raw.get("title", ""))
    company_name = normalize_company_name(raw.get("company", ""))
    location = clean_text(raw.get("location", ""))
    country = normalize_country(raw.get("country", ""), location)
    description = clean_text(raw.get("description", ""))
    salary_raw = clean_text(raw.get("salary", ""))
    source = clean_text(raw.get("source", "unknown"))
    external_id = clean_text(raw.get("external_id", "")) or stable_hash(
        title,
        company_name,
        source,
    )

    published_at = parse_date(raw.get("published_at", ""))

    salary_min, salary_max, salary_currency = extract_salary(salary_raw)

    temp_job = {
        **raw,
        "title": title,
        "company": company_name,
        "country": country,
        "location": location,
        "description": description,
        "salary": salary_raw,
        "published_at": published_at,
    }

    ai_relevant = is_ai_relevant(temp_job)
    category = classify_category(temp_job)
    skills = extract_skills(temp_job)
    remote_type = detect_remote_type(temp_job)
    experience_level = detect_experience_level(temp_job)
    visa_sponsorship = detect_visa_sponsorship(temp_job)
    employment_type = detect_employment_type(temp_job)

    company_slug = slugify(company_name, "company")
    slug = build_job_slug(title, company_name, country, source, external_id)

    description_summary = build_description_summary(description, title, company_name)

    job: dict[str, Any] = {
        "id": slug,
        "slug": slug,
        "title": title,
        "seo_title": "",
        "seo_description": "",
        "company": {
            "name": company_name,
            "slug": company_slug,
            "logo_url": None,
            "website": None,
        },
        "country": country,
        "city": None,
        "location": location,
        "location_label": "",
        "remote_type": remote_type,
        "employment_type": employment_type,
        "experience_level": experience_level,
        "visa_sponsorship": visa_sponsorship,
        "salary_min": salary_min,
        "salary_max": salary_max,
        "salary_currency": salary_currency,
        "skills": skills,
        "category": category,
        "description_summary": description_summary,
        "apply_url": normalize_url(raw.get("apply_url", "")),
        "source": source,
        "source_url": normalize_url(raw.get("source_url", "")),
        "published_at": published_at,
        "expires_at": None,
        "quality_score": 0,
        "status": "pending",
        "schema": {},
        "ai_relevant": ai_relevant,
    }

    job["location_label"] = build_location_label(remote_type, country, location)
    job["seo_title"] = build_seo_title(job)
    job["seo_description"] = build_seo_description(job)

    expired = is_older_than(published_at, 45)
    score = calculate_quality_score(job, is_duplicate=is_duplicate)

    if not ai_relevant:
        score = min(score, 30)

    if len(skills) == 0:
        score = min(score, 55)

    if category == "AI Engineering" and not ai_relevant:
        score = min(score, 30)

    job["quality_score"] = score
    job["status"] = resolve_status(score, is_duplicate=is_duplicate, expired=expired)

    if not ai_relevant:
        job["status"] = "rejected"

    job["schema"] = build_jobposting_schema(job)

    return job


def build_companies(jobs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    companies: dict[str, dict[str, Any]] = {}

    for job in jobs:
        company = job.get("company", {})

        if not isinstance(company, dict):
            continue

        slug = company.get("slug")
        name = company.get("name")

        if not slug or not name:
            continue

        if slug not in companies:
            companies[slug] = {
                "name": name,
                "slug": slug,
                "logo_url": company.get("logo_url"),
                "website": company.get("website"),
                "jobs_count": 0,
            }

        companies[slug]["jobs_count"] += 1

    return sorted(
        companies.values(),
        key=lambda item: item["jobs_count"],
        reverse=True,
    )


def build_categories(jobs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    categories: dict[str, dict[str, Any]] = {}

    for job in jobs:
        name = job.get("category") or "AI Engineering"
        slug = slugify(name)

        if slug not in categories:
            categories[slug] = {
                "name": name,
                "slug": slug,
                "jobs_count": 0,
            }

        categories[slug]["jobs_count"] += 1

    return sorted(
        categories.values(),
        key=lambda item: item["jobs_count"],
        reverse=True,
    )


def build_countries(jobs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    countries: dict[str, dict[str, Any]] = {}

    for job in jobs:
        name = job.get("country") or "Worldwide"
        slug = slugify(name)

        if slug not in countries:
            countries[slug] = {
                "name": name,
                "slug": slug,
                "jobs_count": 0,
            }

        countries[slug]["jobs_count"] += 1

    return sorted(
        countries.values(),
        key=lambda item: item["jobs_count"],
        reverse=True,
    )


def build_stats(
    raw_jobs: list[dict[str, Any]],
    processed: list[dict[str, Any]],
    published_jobs: list[dict[str, Any]],
) -> dict[str, Any]:
    status_counter = Counter(job.get("status", "unknown") for job in processed)
    source_counter = Counter(job.get("source", "unknown") for job in processed)
    category_counter = Counter(job.get("category", "unknown") for job in published_jobs)
    country_counter = Counter(job.get("country", "unknown") for job in published_jobs)

    ai_relevant_count = sum(1 for job in processed if job.get("ai_relevant") is True)
    visa_count = sum(1 for job in published_jobs if job.get("visa_sponsorship") is True)
    remote_count = sum(1 for job in published_jobs if job.get("remote_type") == "remote")
    salary_count = sum(
        1
        for job in published_jobs
        if job.get("salary_min") or job.get("salary_max")
    )

    return {
        "raw_count": len(raw_jobs),
        "processed_count": len(processed),
        "published_count": len(published_jobs),
        "ai_relevant_count": ai_relevant_count,
        "remote_count": remote_count,
        "visa_count": visa_count,
        "salary_count": salary_count,
        "status_counts": dict(status_counter),
        "source_counts": dict(source_counter),
        "category_counts": dict(category_counter),
        "country_counts": dict(country_counter),
    }


def main() -> None:
    raw_jobs = load_raw_jobs()

    seen = set()
    processed = []

    for raw in raw_jobs:
        if not isinstance(raw, dict):
            continue

        key = dedupe_key(raw)
        is_duplicate = key in seen
        seen.add(key)

        job = transform_job(raw, is_duplicate=is_duplicate)
        processed.append(job)

    published_jobs = [
        job
        for job in processed
        if job.get("status") == "published"
    ]

    published_jobs = sorted(
        published_jobs,
        key=lambda item: (
            item.get("published_at", ""),
            item.get("quality_score", 0),
        ),
        reverse=True,
    )

    stats = build_stats(raw_jobs, processed, published_jobs)

    write_json(OUTPUT_DIR / "jobs.json", published_jobs)
    write_json(OUTPUT_DIR / "companies.json", build_companies(published_jobs))
    write_json(OUTPUT_DIR / "categories.json", build_categories(published_jobs))
    write_json(OUTPUT_DIR / "countries.json", build_countries(published_jobs))
    write_json(OUTPUT_DIR / "stats.json", stats)

    print(f"Raw jobs: {len(raw_jobs)}")
    print(f"Processed jobs: {len(processed)}")
    print(f"AI relevant jobs: {stats['ai_relevant_count']}")
    print(f"Published jobs: {len(published_jobs)}")
    print(f"Rejected jobs: {stats['status_counts'].get('rejected', 0)}")
    print(f"Duplicate jobs: {stats['status_counts'].get('duplicate', 0)}")
    print(f"Expired jobs: {stats['status_counts'].get('expired', 0)}")
    print(f"Output directory: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
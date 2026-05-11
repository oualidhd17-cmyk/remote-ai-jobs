from __future__ import annotations

from typing import Any

from utils import compact_summary, slugify


def build_job_slug(
    title: str,
    company: str,
    country: str,
    source: str,
    external_id: str,
) -> str:
    base = slugify(f"{title} {company} {country}", "remote-ai-job")
    unique = slugify(f"{source} {external_id}", "job")
    return f"{base}-{unique}"[:160].strip("-")


def build_seo_title(job: dict[str, Any]) -> str:
    title = job.get("title", "Remote AI Job")
    country = job.get("country", "Remote")
    category = job.get("category", "AI")

    if country == "Worldwide":
        return f"Remote {title} Job | {category} Jobs"

    return f"Remote {title} Job in {country} | {category} Jobs"


def build_seo_description(job: dict[str, Any]) -> str:
    title = job.get("title", "AI role")

    company = job.get("company", {})
    if isinstance(company, dict):
        company_name = company.get("name", "a hiring company")
    else:
        company_name = "a hiring company"

    country = job.get("country", "Remote")
    skills = job.get("skills", []) or []

    skill_text = ", ".join(skills[:4])

    if skill_text:
        return compact_summary(
            f"Apply for a remote {title} job at {company_name} in {country}. Explore {skill_text} and remote AI jobs.",
            155,
        )

    return compact_summary(
        f"Apply for a remote {title} job at {company_name} in {country}. Explore remote AI jobs and visa sponsorship opportunities.",
        155,
    )


def build_description_summary(raw_description: str, title: str, company: str) -> str:
    summary = compact_summary(raw_description, 260)

    if len(summary) >= 90:
        return summary

    return compact_summary(
        f"{company} is hiring a remote {title}. Review the role, required skills, location, and apply on the company website.",
        260,
    )


def build_location_label(remote_type: str, country: str, location: str) -> str:
    if remote_type == "remote":
        if country and country != "Worldwide":
            return f"Remote - {country}"

        return "Remote - Worldwide"

    if location:
        return location

    return country or "Remote"


def build_jobposting_schema(job: dict[str, Any]) -> dict[str, Any]:
    employment_map = {
        "full-time": "FULL_TIME",
        "part-time": "PART_TIME",
        "contract": "CONTRACTOR",
        "internship": "INTERN",
    }

    company = job.get("company", {})
    company_name = ""

    if isinstance(company, dict):
        company_name = company.get("name", "")

    schema: dict[str, Any] = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": job.get("title"),
        "description": job.get("description_summary"),
        "datePosted": job.get("published_at"),
        "employmentType": employment_map.get(job.get("employment_type"), "FULL_TIME"),
        "hiringOrganization": {
            "@type": "Organization",
            "name": company_name,
        },
        "directApply": False,
        "url": job.get("source_url") or job.get("apply_url"),
    }

    if job.get("remote_type") == "remote":
        schema["jobLocationType"] = "TELECOMMUTE"

        country = job.get("country")

        if country and country != "Worldwide":
            schema["applicantLocationRequirements"] = {
                "@type": "Country",
                "name": country,
            }

    if job.get("salary_min") or job.get("salary_max"):
        schema["baseSalary"] = {
            "@type": "MonetaryAmount",
            "currency": job.get("salary_currency") or "USD",
            "value": {
                "@type": "QuantitativeValue",
                "minValue": job.get("salary_min"),
                "maxValue": job.get("salary_max"),
                "unitText": "YEAR",
            },
        }

    return schema
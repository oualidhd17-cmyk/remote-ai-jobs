from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from xml.sax.saxutils import escape

from utils import OUTPUT_DIR, SITE_URL, read_json


STATIC_ROUTES = [
    "/",
    "/jobs/",
    "/remote-ai-jobs/",
    "/ai-jobs-with-visa-sponsorship/",
    "/entry-level-ai-jobs/",
    "/junior-ai-jobs/",
    "/remote-machine-learning-jobs/",
    "/remote-data-science-jobs/",
    "/remote-mlops-jobs/",
    "/prompt-engineer-jobs/",
    "/ai-jobs-usa/",
    "/ai-jobs-canada/",
    "/ai-jobs-germany/",
    "/ai-jobs-uk/",
    "/remote-ai-jobs-usa/",
    "/remote-ai-jobs-canada/",
    "/remote-ai-jobs-germany/",
    "/remote-ai-jobs-uk/",
]


def today() -> str:
    return datetime.now(timezone.utc).date().isoformat()


def url_item(path: str, lastmod: str | None = None, priority: str = "0.7") -> str:
    loc = f"{SITE_URL.rstrip('/')}/{path.lstrip('/')}"

    return (
        "  <url>\n"
        f"    <loc>{escape(loc)}</loc>\n"
        f"    <lastmod>{lastmod or today()}</lastmod>\n"
        f"    <priority>{priority}</priority>\n"
        "  </url>"
    )


def write_sitemap(path: Path, urls: list[str]) -> None:
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls)
        + "\n</urlset>\n"
    )

    path.write_text(xml, encoding="utf-8")


def write_sitemap_index(path: Path) -> None:
    items = [
        "sitemap-pages.xml",
        "sitemap-jobs.xml",
        "sitemap-categories.xml",
        "sitemap-countries.xml",
    ]

    xml_items = []

    for item in items:
        loc = f"{SITE_URL.rstrip('/')}/{item}"

        xml_items.append(
            "  <sitemap>\n"
            f"    <loc>{escape(loc)}</loc>\n"
            f"    <lastmod>{today()}</lastmod>\n"
            "  </sitemap>"
        )

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(xml_items)
        + "\n</sitemapindex>\n"
    )

    path.write_text(xml, encoding="utf-8")


def main() -> None:
    jobs: list[dict[str, Any]] = read_json(OUTPUT_DIR / "jobs.json")
    categories: list[dict[str, Any]] = read_json(OUTPUT_DIR / "categories.json")
    countries: list[dict[str, Any]] = read_json(OUTPUT_DIR / "countries.json")

    page_urls = [
        url_item(route, priority="0.9" if route == "/" else "0.8")
        for route in STATIC_ROUTES
    ]

    job_urls = [
        url_item(f"/jobs/{job['slug']}/", job.get("published_at"), "0.75")
        for job in jobs
        if job.get("slug")
    ]

    category_urls = [
        url_item(f"/categories/{category['slug']}/", priority="0.65")
        for category in categories
        if category.get("slug")
    ]

    country_urls = [
        url_item(f"/countries/{country['slug']}/", priority="0.65")
        for country in countries
        if country.get("slug")
    ]

    write_sitemap(OUTPUT_DIR / "sitemap-pages.xml", page_urls)
    write_sitemap(OUTPUT_DIR / "sitemap-jobs.xml", job_urls)
    write_sitemap(OUTPUT_DIR / "sitemap-categories.xml", category_urls)
    write_sitemap(OUTPUT_DIR / "sitemap-countries.xml", country_urls)
    write_sitemap_index(OUTPUT_DIR / "sitemap.xml")

    print("Sitemaps generated:")
    print(f"- {OUTPUT_DIR / 'sitemap.xml'}")
    print(f"- {OUTPUT_DIR / 'sitemap-jobs.xml'}")


if __name__ == "__main__":
    main()
from __future__ import annotations

from clean import main as clean_main
from sitemap import main as sitemap_main


def main() -> None:
    clean_main()
    sitemap_main()


if __name__ == "__main__":
    main()
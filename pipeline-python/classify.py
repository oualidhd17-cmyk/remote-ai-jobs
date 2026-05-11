from __future__ import annotations

from typing import Any

from utils import contains_any, safe_job_text

STRONG_AI_KEYWORDS = [
    "artificial intelligence",
    "ai engineer",
    "ai engineering",
    "machine learning",
    "ml engineer",
    "deep learning",
    "data scientist",
    "data science",
    "mlops",
    "model training",
    "model deployment",
    "model serving",
    "llm",
    "large language model",
    "generative ai",
    "genai",
    "prompt engineer",
    "prompt engineering",
    "chatgpt",
    "openai",
    "langchain",
    "rag",
    "retrieval augmented generation",
    "nlp",
    "natural language processing",
    "transformers",
    "computer vision",
    "opencv",
    "pytorch",
    "tensorflow",
    "scikit-learn",
    "sklearn",
    "kubeflow",
    "mlflow",
    "feature store",
    "recommendation system",
    "recommendation engine",
    "robotics",
    "autonomous systems",
    "ai product manager",
    "ai product",
    "ai platform",
    "ai infrastructure",
]

WEAK_AI_KEYWORDS = [
    "ai",
    "ml",
    "data",
    "analytics",
    "python",
    "automation",
    "model",
]

BLOCKED_TITLE_KEYWORDS = [
    "customer support",
    "support representative",
    "customer success",
    "sales development",
    "sales representative",
    "account executive",
    "account manager",
    "marketing manager",
    "growth marketer",
    "content writer",
    "copywriter",
    "seo specialist",
    "finance manager",
    "accountant",
    "bookkeeper",
    "hr manager",
    "recruiter",
    "talent acquisition",
    "legal counsel",
    "paralegal",
    "operations manager",
    "warehouse",
    "driver",
    "delivery",
    "nurse",
    "physician",
    "therapist",
    "designer",
    "graphic designer",
    "product designer",
    "cnc",
    "machinist",
    "milling",
    "mechanic",
    "electrician",
    "plumber",
    "real estate",
    "virtual assistant",
    "executive assistant",
    "administrative assistant",
]

CATEGORY_RULES: dict[str, list[str]] = {
    "AI Engineering": [
        "ai engineer",
        "artificial intelligence engineer",
        "generative ai",
        "genai",
        "llm engineer",
        "ai platform",
        "ai systems",
        "ai application",
        "ai infrastructure",
    ],
    "Machine Learning": [
        "machine learning",
        "ml engineer",
        "model training",
        "tensorflow",
        "pytorch",
        "scikit",
        "deep learning",
        "recommendation system",
        "recommendation engine",
    ],
    "Data Science": [
        "data scientist",
        "data science",
        "statistics",
        "forecasting",
        "experiment",
        "pandas",
        "notebook",
        "predictive model",
    ],
    "Data Analytics": [
        "data analyst",
        "analytics engineer",
        "business intelligence",
        "bi analyst",
        "sql analyst",
        "dashboard",
    ],
    "MLOps": [
        "mlops",
        "ml platform",
        "model deployment",
        "mlflow",
        "kubeflow",
        "feature store",
        "model serving",
        "kubernetes",
        "docker",
        "pipeline",
    ],
    "Prompt Engineering": [
        "prompt engineer",
        "prompt engineering",
        "llm prompts",
        "chatgpt",
        "langchain",
        "prompt design",
    ],
    "AI Product": [
        "ai product manager",
        "product manager ai",
        "product owner ai",
        "ai product",
        "generative ai product",
    ],
    "Computer Vision": [
        "computer vision",
        "opencv",
        "image recognition",
        "object detection",
        "image segmentation",
        "vision model",
    ],
    "NLP": [
        "nlp",
        "natural language processing",
        "transformers",
        "language model",
        "text classification",
        "llm",
    ],
    "Robotics": [
        "robotics",
        "robot",
        "autonomous systems",
        "ros",
    ],
    "Cybersecurity AI": [
        "security ai",
        "cybersecurity ai",
        "threat detection",
        "fraud detection",
        "ai security",
    ],
    "Healthcare AI": [
        "healthcare ai",
        "medical ai",
        "clinical ai",
        "bioinformatics",
        "health data",
    ],
}

SKILL_RULES: dict[str, list[str]] = {
    "Python": ["python"],
    "SQL": ["sql"],
    "Machine Learning": ["machine learning", "ml engineer"],
    "Deep Learning": ["deep learning"],
    "TensorFlow": ["tensorflow"],
    "PyTorch": ["pytorch"],
    "Scikit-learn": ["scikit", "sklearn"],
    "Pandas": ["pandas"],
    "NumPy": ["numpy"],
    "LLM": ["llm", "large language model"],
    "LangChain": ["langchain"],
    "OpenAI": ["openai"],
    "RAG": ["rag", "retrieval augmented"],
    "NLP": ["nlp", "natural language processing"],
    "Computer Vision": ["computer vision", "opencv"],
    "MLOps": ["mlops"],
    "Docker": ["docker"],
    "Kubernetes": ["kubernetes", "k8s"],
    "AWS": ["aws", "amazon web services"],
    "GCP": ["gcp", "google cloud"],
    "Azure": ["azure"],
    "Spark": ["spark", "pyspark"],
    "Airflow": ["airflow"],
    "MLflow": ["mlflow"],
    "Kubeflow": ["kubeflow"],
    "Tableau": ["tableau"],
    "Power BI": ["power bi", "powerbi"],
    "Statistics": ["statistics", "statistical"],
    "Prompt Engineering": ["prompt engineering", "prompt engineer"],
    "Generative AI": ["generative ai", "genai"],
}

REMOTE_RULES: dict[str, list[str]] = {
    "remote": [
        "remote",
        "fully remote",
        "work from anywhere",
        "distributed team",
        "work remotely",
    ],
    "hybrid": [
        "hybrid",
        "partly remote",
        "2 days office",
        "3 days office",
    ],
    "onsite": [
        "onsite",
        "on-site",
        "office based",
        "in office",
    ],
}

EXPERIENCE_RULES: dict[str, list[str]] = {
    "intern": [
        "intern",
        "internship",
        "student",
    ],
    "entry": [
        "entry level",
        "entry-level",
        "graduate",
        "new grad",
        "junior",
        "0-1 years",
        "0-2 years",
    ],
    "junior": [
        "junior",
        "jr.",
        "1+ years",
        "1 year",
    ],
    "mid": [
        "mid-level",
        "mid level",
        "2+ years",
        "3+ years",
        "4+ years",
    ],
    "senior": [
        "senior",
        "sr.",
        "5+ years",
        "6+ years",
        "7+ years",
        "lead",
        "principal",
        "staff engineer",
    ],
}

VISA_POSITIVE = [
    "visa sponsorship",
    "sponsorship available",
    "work visa",
    "relocation support",
    "skilled worker visa",
    "h1b",
    "h-1b",
    "sponsor visa",
    "visa support",
]

VISA_NEGATIVE = [
    "no sponsorship",
    "must be authorized to work",
    "we do not sponsor",
    "cannot sponsor",
    "unable to sponsor",
]

EMPLOYMENT_RULES: dict[str, list[str]] = {
    "full-time": [
        "full-time",
        "full time",
        "permanent",
    ],
    "part-time": [
        "part-time",
        "part time",
    ],
    "contract": [
        "contract",
        "freelance",
        "temporary",
    ],
    "internship": [
        "internship",
        "intern",
    ],
}


def unique_list(values: list[str]) -> list[str]:
    seen = set()
    result = []

    for value in values:
        clean = str(value).strip()

        if not clean:
            continue

        key = clean.lower()

        if key in seen:
            continue

        seen.add(key)
        result.append(clean)

    return result


def has_blocked_title(job: dict[str, Any]) -> bool:
    title = str(job.get("title", "")).lower()
    return any(keyword in title for keyword in BLOCKED_TITLE_KEYWORDS)


def has_strong_ai_signal(job: dict[str, Any]) -> bool:
    text = safe_job_text(job).lower()
    return any(keyword in text for keyword in STRONG_AI_KEYWORDS)


def has_weak_ai_signal(job: dict[str, Any]) -> bool:
    text = safe_job_text(job).lower()
    return any(keyword in text for keyword in WEAK_AI_KEYWORDS)


def is_ai_relevant(job: dict[str, Any]) -> bool:
    if has_strong_ai_signal(job):
        return True

    if has_blocked_title(job):
        return False

    title = str(job.get("title", "")).lower()

    allowed_title_terms = [
        "data engineer",
        "analytics engineer",
        "data analyst",
        "software engineer",
        "backend engineer",
        "platform engineer",
        "infrastructure engineer",
    ]

    has_allowed_title = any(term in title for term in allowed_title_terms)

    if has_allowed_title and has_weak_ai_signal(job):
        return True

    return False


def classify_category(job: dict[str, Any]) -> str:
    text = safe_job_text(job)

    for category, keywords in CATEGORY_RULES.items():
        if contains_any(text, keywords):
            return category

    return "AI Engineering"


def extract_skills(job: dict[str, Any]) -> list[str]:
    text = safe_job_text(job)
    found = []

    for skill, keywords in SKILL_RULES.items():
        if contains_any(text, keywords):
            found.append(skill)

    tags = job.get("tags", []) or []

    if isinstance(tags, list):
        for tag in tags:
            if isinstance(tag, str) and len(tag) <= 32:
                found.append(tag)

    return unique_list(found)[:12]


def detect_remote_type(job: dict[str, Any]) -> str:
    text = safe_job_text(job)

    for remote_type, keywords in REMOTE_RULES.items():
        if contains_any(text, keywords):
            return remote_type

    return "unknown"


def detect_experience_level(job: dict[str, Any]) -> str:
    text = safe_job_text(job)

    for level, keywords in EXPERIENCE_RULES.items():
        if contains_any(text, keywords):
            return level

    return "mid"


def detect_visa_sponsorship(job: dict[str, Any]) -> bool:
    text = safe_job_text(job)

    if contains_any(text, VISA_NEGATIVE):
        return False

    if contains_any(text, VISA_POSITIVE):
        return True

    return False


def detect_employment_type(job: dict[str, Any]) -> str:
    text = safe_job_text(job)

    for employment_type, keywords in EMPLOYMENT_RULES.items():
        if contains_any(text, keywords):
            return employment_type

    return "full-time"
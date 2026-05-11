export type RemoteType = 'remote' | 'hybrid' | 'onsite' | 'unknown';

export type EmploymentType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'internship';

export type ExperienceLevel =
  | 'intern'
  | 'entry'
  | 'junior'
  | 'mid'
  | 'senior';

export type JobStatus =
  | 'published'
  | 'expired'
  | 'rejected'
  | 'duplicate'
  | 'pending';

export type JobCompany = {
  name: string;
  slug: string;
  logo_url: string | null;
  website: string | null;
};

export type JobPostingSchema = Record<string, unknown>;

export type Job = {
  id: string;
  slug: string;
  title: string;
  seo_title: string;
  seo_description: string;
  company: JobCompany;
  country: string;
  city: string | null;
  location: string;
  location_label: string;
  remote_type: RemoteType;
  employment_type: EmploymentType;
  experience_level: ExperienceLevel;
  visa_sponsorship: boolean;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  skills: string[];
  category: string;
  description_summary: string;
  apply_url: string;
  source: string;
  source_url: string;
  published_at: string;
  expires_at: string | null;
  quality_score: number;
  status: JobStatus;
  schema: JobPostingSchema;
  ai_relevant?: boolean;
};

export type CountItem = {
  name: string;
  slug: string;
  jobs_count: number;
};

export type CompanyItem = CountItem & {
  logo_url: string | null;
  website: string | null;
};

export type PipelineStats = {
  raw_count: number;
  processed_count: number;
  published_count: number;
  ai_relevant_count: number;
  remote_count: number;
  visa_count: number;
  salary_count: number;
  status_counts: Record<string, number>;
  source_counts: Record<string, number>;
  category_counts: Record<string, number>;
  country_counts: Record<string, number>;
};

export type JobFilterState = {
  keyword: string;
  country: string;
  category: string;
  remoteType: string;
  visa: string;
  experience: string;
  salary: string;
};
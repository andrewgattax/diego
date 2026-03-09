import type { JobPosition, ExperienceLevel, StartDate, ReferralSource, SalaryRange } from "@/types/form";

export const JOB_POSITIONS: JobPosition[] = [
  "Senior Frontend Engineer",
  "Backend Engineer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Product Designer",
  "Technical Product Manager",
  "Data Engineer",
];

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  "Entry Level (0-2 years)",
  "Mid Level (2-5 years)",
  "Senior Level (5-10 years)",
  "Lead/Principal (10+ years)",
];

export const START_DATES: StartDate[] = [
  "Immediately",
  "Today"
];

export const REFERRAL_SOURCES: ReferralSource[] = [
  "LinkedIn",
  "Indeed",
  "Company Website",
  "Referral",
  "Social Media",
  "Other",
];

export const SALARY_RANGES: SalaryRange[] = [
  "$50k - $70k",
  "$70k - $90k",
  "$90k - $120k",
  "$120k - $150k",
  "$150k+",
];

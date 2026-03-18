// Form field types
export type JobPosition =
  | "Senior Frontend Engineer"
  | "Backend Engineer"
  | "Full Stack Developer"
  | "DevOps Engineer"
  | "Product Designer"
  | "Technical Product Manager"
  | "Data Engineer";

export type ExperienceLevel =
  | "Entry Level (0-2 years)"
  | "Mid Level (2-5 years)"
  | "Senior Level (5-10 years)"
  | "Lead/Principal (10+ years)";

export type StartDate =
  | "Immediately"
  | "Today"

export type ReferralSource =
  | "LinkedIn"
  | "Indeed"
  | "Company Website"
  | "Referral"
  | "Social Media"
  | "Other";

export type SalaryRange =
  | "$50k - $70k"
  | "$70k - $90k"
  | "$90k - $120k"
  | "$120k - $150k"
  | "$150k+";

// Main form data interface
export interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;

  // Position Details
  position: JobPosition | "";
  experienceLevel: ExperienceLevel | "";
  startDate: StartDate | "";

  // Professional Profile
  linkedinUrl: string;
  portfolioUrl: string;
  resume: File | null;
  yearsOfExperience: string;

  // Additional Information
  referralSource: ReferralSource | "";
  coverLetter: string;
  additionalInfo: string;
  salaryRange: SalaryRange | "";

  // Agreements
  certifyAccuracy: boolean;
  agreeToTerms: boolean;
  consentBackgroundCheck: boolean;
  subscribeNewsletter: boolean;
}

// Form validation errors interface
export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  position?: string;
  experienceLevel?: string;
  startDate?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  referralSource?: string;
  coverLetter?: string;
  additionalInfo?: string;
  certifyAccuracy?: string;
  agreeToTerms?: string;
  consentBackgroundCheck?: string;
}

// Form section props
export interface FormSectionProps {
  errors: FormErrors;
  formData: FormData;
  handleChange: (field: keyof FormData, value: string | boolean | File | null) => void;
  handleBlur?: (field: keyof FormData) => void;
}

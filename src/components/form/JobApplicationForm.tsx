import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { FormData, FormErrors } from "@/types/form";
import PersonalInfoSection from "./PersonalInfoSection";
import PositionSection from "./PositionSection";
import ExperienceSection from "./ExperienceSection";
import CoverLetterSection from "./CoverLetterSection";
import SubmitSection from "./SubmitSection";

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  position: "",
  experienceLevel: "",
  startDate: "",
  linkedinUrl: "",
  portfolioUrl: "",
  resume: null,
  yearsOfExperience: "",
  referralSource: "",
  coverLetter: "",
  additionalInfo: "",
  salaryRange: "",
  certifyAccuracy: false,
  agreeToTerms: false,
  consentBackgroundCheck: false,
  subscribeNewsletter: false,
};

const validationRules = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\s\-\+\(\)]+$/,
  url: /^https?:\/\/.+/,
};

interface JobApplicationFormProps {}

export default function JobApplicationForm({}: JobApplicationFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<keyof FormData>>(
    new Set()
  );
  const formRef = useRef<HTMLFormElement>(null);

  const validateField = (field: keyof FormData, value: any): string | undefined => {
    switch (field) {
      case "firstName":
      case "lastName":
      case "location":
        if (!value || value.toString().trim() === "") {
          return "This field is required";
        }
        break;
      case "position":
      case "experienceLevel":
      case "startDate":
      case "referralSource":
        if (!value || value.toString().trim() === "") {
          return "This field is required";
        }
        break;

      case "email":
        if (!value || value.toString().trim() === "") {
          return "Email is required";
        }
        if (!validationRules.email.test(value)) {
          return "Please enter a valid email address";
        }
        break;

      case "phone":
        if (!value || value.toString().trim() === "") {
          return "Please select a sex";
        }
        break;

      case "linkedinUrl":
      case "portfolioUrl":
        if (value && !validationRules.url.test(value)) {
          return "Please enter a valid URL (starts with http:// or https://)";
        }
        break;

      case "coverLetter":
        if (!value || value.toString().trim() === "") {
          return "Cover letter is required";
        }
        if (value.length < 100) {
          return "Cover letter must be at least 100 characters";
        }
        if (value.length > 2000) {
          return "Cover letter must not exceed 2000 characters";
        }
        break;

      case "additionalInfo":
        if (value && value.length > 500) {
          return "Additional information must not exceed 500 characters";
        }
        break;

      case "certifyAccuracy":
      case "agreeToTerms":
      case "consentBackgroundCheck":
        if (!value) {
          return "You must agree to continue";
        }
        break;

      default:
        break;
    }
    return undefined;
  };

  const handleChange = (field: keyof FormData, value: string | boolean | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validate field if it's been touched
    if (touchedFields.has(field)) {
      const error = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouchedFields((prev) => new Set(prev).add(field));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let hasError = false;

    // Validate all required fields
    const requiredFields: (keyof FormData)[] = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "location",
      "position",
      "experienceLevel",
      "startDate",
      "referralSource",
      "coverLetter",
      "certifyAccuracy",
      "agreeToTerms",
      "consentBackgroundCheck",
    ];

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        (newErrors as Record<string, string>)[field] = error;
        hasError = true;
      }
    });

    // Validate optional fields that have values
    if (formData.linkedinUrl) {
      const error = validateField("linkedinUrl", formData.linkedinUrl);
      if (error) {
        newErrors.linkedinUrl = error;
        hasError = true;
      }
    }

    if (formData.portfolioUrl) {
      const error = validateField("portfolioUrl", formData.portfolioUrl);
      if (error) {
        newErrors.portfolioUrl = error;
        hasError = true;
      }
    }

    if (formData.additionalInfo) {
      const error = validateField("additionalInfo", formData.additionalInfo);
      if (error) {
        newErrors.additionalInfo = error;
        hasError = true;
      }
    }

    setErrors(newErrors);

    if (hasError) {
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0] as keyof FormData;
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
    }

    return !hasError;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = Object.keys(formData) as (keyof FormData)[];
    setTouchedFields(new Set(allFields));

    if (validateForm()) {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);

        // Reset form after showing success message
        setTimeout(() => {
          setFormData(initialFormData);
          setErrors({});
          setIsSubmitted(false);
          setTouchedFields(new Set());
        }, 5000);
      }, 2000);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitted(false);
    setTouchedFields(new Set());
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 sm:p-8">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          {/* Header */}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Join Our Team
            </h1>
            <p className="mt-2 text-muted-foreground">
              Ready to shape the future of technology? We're looking for talented
              individuals to join NovaTech Solutions.
            </p>
          </div>

          <Separator />

          {/* Form Sections */}
          <PersonalInfoSection
            errors={errors}
            formData={formData}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />

          <Separator />

          <PositionSection
            errors={errors}
            formData={formData}
            handleChange={handleChange}
          />

          <Separator />

          <ExperienceSection
            errors={errors}
            formData={formData}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />

          <Separator />

          <CoverLetterSection
            errors={errors}
            formData={formData}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />

          <Separator />

          <SubmitSection
            errors={errors}
            formData={formData}
            handleChange={handleChange}
            isLoading={isLoading}
            isSubmitted={isSubmitted}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        </form>
      </CardContent>
    </Card>
  );
}

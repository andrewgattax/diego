import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormSectionProps } from "@/types/form";
import { REFERRAL_SOURCES, SALARY_RANGES } from "@/constants/jobPositions";

const MIN_COVER_LETTER = 100;
const MAX_COVER_LETTER = 2000;
const MAX_ADDITIONAL_INFO = 500;

export default function CoverLetterSection({
  errors,
  formData,
  handleChange,
  handleBlur,
}: FormSectionProps) {
  const coverLetterCount = formData.coverLetter.length;
  const additionalInfoCount = formData.additionalInfo.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Additional Information</h2>
        <p className="text-sm text-muted-foreground">
          Help us get to know you better.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Referral Source */}
        <div className="space-y-2">
          <Label htmlFor="referralSource">
            How did you hear about us? <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.referralSource}
            onValueChange={(value) => handleChange("referralSource", value)}
          >
            <SelectTrigger
              id="referralSource"
              aria-invalid={!!errors.referralSource}
              className={errors.referralSource ? "border-destructive" : ""}
            >
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {REFERRAL_SOURCES.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.referralSource && (
            <p className="text-sm text-destructive">{errors.referralSource}</p>
          )}
        </div>

        {/* Salary Range */}
        <div className="space-y-2">
          <Label htmlFor="salaryRange">
            Expected Salary Range
            <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Select
            value={formData.salaryRange}
            onValueChange={(value) => handleChange("salaryRange", value)}
          >
            <SelectTrigger id="salaryRange">
              <SelectValue placeholder="Select salary range" />
            </SelectTrigger>
            <SelectContent>
              {SALARY_RANGES.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cover Letter */}
      <div className="space-y-2">
        <Label htmlFor="coverLetter">
          Cover Letter <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="coverLetter"
          value={formData.coverLetter}
          onChange={(e) => handleChange("coverLetter", e.target.value)}
          onBlur={() => handleBlur?.("coverLetter")}
          placeholder="Tell us why you're interested in this position and what makes you a great fit..."
          rows={8}
          className={`resize-none ${
            errors.coverLetter ? "border-destructive" : ""
          }`}
          aria-invalid={!!errors.coverLetter}
          aria-describedby={`${errors.coverLetter ? "coverLetter-error " : ""}coverLetter-count`}
        />
        <div className="flex items-center justify-between">
          {errors.coverLetter && (
            <p id="coverLetter-error" className="text-sm text-destructive">
              {errors.coverLetter}
            </p>
          )}
          <p
            id="coverLetter-count"
            className={`ml-auto text-sm ${
              coverLetterCount < MIN_COVER_LETTER || coverLetterCount > MAX_COVER_LETTER
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {coverLetterCount} / {MAX_COVER_LETTER} characters
            {coverLetterCount < MIN_COVER_LETTER && ` (minimum ${MIN_COVER_LETTER})`}
          </p>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-2">
        <Label htmlFor="additionalInfo">
          Additional Information
          <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="additionalInfo"
          value={formData.additionalInfo}
          onChange={(e) => handleChange("additionalInfo", e.target.value)}
          onBlur={() => handleBlur?.("additionalInfo")}
          placeholder="Is there anything else you'd like us to know?"
          rows={4}
          className="resize-none"
          aria-describedby="additionalInfo-count"
        />
        <p
          id="additionalInfo-count"
          className={`text-right text-sm ${
            additionalInfoCount > MAX_ADDITIONAL_INFO
              ? "text-destructive"
              : "text-muted-foreground"
          }`}
        >
          {additionalInfoCount} / {MAX_ADDITIONAL_INFO} characters
        </p>
      </div>
    </div>
  );
}

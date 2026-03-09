import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { FormSectionProps } from "@/types/form";

interface SubmitSectionProps extends FormSectionProps {
  isLoading: boolean;
  isSubmitted: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

export default function SubmitSection({
  errors,
  formData,
  handleChange,
  isLoading,
  isSubmitted,
  onSubmit,
  onReset,
}: SubmitSectionProps) {
  return (
    <div className="space-y-6">
      {/* Agreements */}
      <div className="space-y-4 rounded-lg border border-border bg-muted/40 p-6">
        <h3 className="text-lg font-semibold">Agreements</h3>

        {/* Certify Accuracy */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="certifyAccuracy"
            checked={formData.certifyAccuracy}
            onCheckedChange={(checked) =>
              handleChange("certifyAccuracy", checked === true)
            }
            aria-invalid={!!errors.certifyAccuracy}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="certifyAccuracy"
              className="font-normal peer-data-[state=checked]:text-foreground"
            >
              I certify that all information provided in this application is accurate
              and complete. <span className="text-destructive">*</span>
            </Label>
            {errors.certifyAccuracy && (
              <p className="text-sm text-destructive">{errors.certifyAccuracy}</p>
            )}
          </div>
        </div>

        {/* Agree to Terms */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) =>
              handleChange("agreeToTerms", checked === true)
            }
            aria-invalid={!!errors.agreeToTerms}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="agreeToTerms"
              className="font-normal peer-data-[state=checked]:text-foreground"
            >
              I agree to the{" "}
              <button
                type="button"
                onClick={(e) => e.preventDefault()}
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={(e) => e.preventDefault()}
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </button>
              . <span className="text-destructive">*</span>
            </Label>
            {errors.agreeToTerms && (
              <p className="text-sm text-destructive">{errors.agreeToTerms}</p>
            )}
          </div>
        </div>

        {/* Background Check */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="consentBackgroundCheck"
            checked={formData.consentBackgroundCheck}
            onCheckedChange={(checked) =>
              handleChange("consentBackgroundCheck", checked === true)
            }
            aria-invalid={!!errors.consentBackgroundCheck}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="consentBackgroundCheck"
              className="font-normal peer-data-[state=checked]:text-foreground"
            >
              I consent to background checks as part of the hiring process.{" "}
              <span className="text-destructive">*</span>
            </Label>
            {errors.consentBackgroundCheck && (
              <p className="text-sm text-destructive">
                {errors.consentBackgroundCheck}
              </p>
            )}
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="subscribeNewsletter"
            checked={formData.subscribeNewsletter}
            onCheckedChange={(checked) =>
              handleChange("subscribeNewsletter", checked === true)
            }
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="subscribeNewsletter"
              className="font-normal peer-data-[state=checked]:text-foreground"
            >
              Subscribe to job alerts and company updates.
            </Label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          disabled={isLoading || isSubmitted}
          className="sm:w-auto"
        >
          Reset Form
        </Button>
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={isLoading || isSubmitted}
          className="min-w-[140px] sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : isSubmitted ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Submitted
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>

      {/* Success Message */}
      {isSubmitted && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900 dark:text-green-100">
                Application Submitted Successfully!
              </h4>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                Thank you for your interest in joining NovaTech Solutions. We've
                received your application and will review it shortly. If your
                qualifications match our needs, a member of our team will reach
                out to you within 5-7 business days.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

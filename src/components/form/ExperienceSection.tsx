"use client"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { FormSectionProps } from "@/types/form";
import { Upload, Link as LinkIcon } from "lucide-react";

export default function ExperienceSection({
  errors,
  formData,
  handleChange,
  handleBlur,
}: FormSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Professional Profile</h2>
        <p className="text-sm text-muted-foreground">
          Share your professional links and experience.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {/* LinkedIn URL */}
        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">
            LinkedIn Profile URL
            <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
          </Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="linkedinUrl"
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => handleChange("linkedinUrl", e.target.value)}
              onBlur={() => handleBlur?.("linkedinUrl")}
              placeholder="https://linkedin.com/in/johndoe"
              className="pl-9"
              aria-invalid={!!errors.linkedinUrl}
            />
          </div>
          {errors.linkedinUrl && (
            <p className="text-sm text-destructive">{errors.linkedinUrl}</p>
          )}
        </div>

        {/* Portfolio URL */}
        <div className="space-y-2">
          <Label htmlFor="portfolioUrl">
            Portfolio/GitHub URL
            <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
          </Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="portfolioUrl"
              type="url"
              value={formData.portfolioUrl}
              onChange={(e) => handleChange("portfolioUrl", e.target.value)}
              onBlur={() => handleBlur?.("portfolioUrl")}
              placeholder="https://github.com/johndoe"
              className="pl-9"
              aria-invalid={!!errors.portfolioUrl}
            />
          </div>
          {errors.portfolioUrl && (
            <p className="text-sm text-destructive">{errors.portfolioUrl}</p>
          )}
        </div>

        {/* Years of Experience */}
        <div className="space-y-2">
          <Label htmlFor="yearsOfExperience">
            Years of Experience
            <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="yearsOfExperience"
            type="number"
            min="0"
            max="50"
            value={formData.yearsOfExperience}
            onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
            placeholder="5"
          />
        </div>

        {/* Resume Upload */}
        <div className="space-y-2">
          <Label htmlFor="resume">
            Resume/CV
            <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
          </Label>
          <div className="relative">
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleChange("resume", e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Accepted formats: PDF, DOC, DOCX (max 5MB)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

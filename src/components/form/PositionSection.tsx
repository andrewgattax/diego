import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { FormSectionProps } from "@/types/form";
import { JOB_POSITIONS, EXPERIENCE_LEVELS, START_DATES } from "@/constants/jobPositions";
import {Textarea} from "@/components/ui/textarea.tsx";
import { useDiego } from "@/contexts/DiegoContext";

export default function PositionSection({
  errors,
  formData,
  handleChange,
}: FormSectionProps) {
  const { flash, startDiego } = useDiego();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Sex?</h2>
        <p className="text-sm text-muted-foreground">Tell us about the role you're interested in.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Position */}

        {/* Sex? Textarea */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="location">
            Sex? <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            onFocus={startDiego}
            placeholder="Tell us more..."
            rows={3}
            className="resize-none"
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? "location-error" : undefined}
          />
          {errors.location && (
            <p id="location-error" className="text-sm text-destructive">
              {errors.location}
            </p>
          )}
        </div>

        {/* Start Date */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="startDate">
            Expected Start Date <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.startDate}
            onValueChange={(value) => handleChange("startDate", value)}
          >
            <SelectTrigger
              id="startDate"
              aria-invalid={!!errors.startDate}
              className={errors.startDate ? "border-destructive" : ""}
            >
              <SelectValue placeholder="When can you start?" />
            </SelectTrigger>
            <SelectContent>
              {START_DATES.map((date) => (
                <SelectItem key={date} value={date}>
                  {date}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.startDate && (
            <p className="text-sm text-destructive">{errors.startDate}</p>
          )}
        </div>

        {/* Selected Position Badge */}
        {formData.position && (
          <div className="sm:col-span-2">
            <p className="text-sm text-muted-foreground">
              Applying for:{" "}
              <Badge variant="secondary" className="ml-1">
                {formData.position}
              </Badge>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

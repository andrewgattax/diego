import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormSectionProps } from "@/types/form";
import { JOB_POSITIONS, EXPERIENCE_LEVELS, START_DATES } from "@/constants/jobPositions";
import {useDiego} from "@/contexts/DiegoContext.tsx";


export default function PersonalInfoSection({
  errors,
  formData,
  handleChange,
  handleBlur,
}: FormSectionProps) {

  const { flash } = useDiego();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Personal Information</h2>
        <p className="text-sm text-muted-foreground">Please provide your contact details.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            onBlur={() => handleBlur?.("firstName")}
            placeholder="John"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
          />
          {errors.firstName && (
            <p id="firstName-error" className="text-sm text-destructive">
              {errors.firstName}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            onBlur={() => handleBlur?.("lastName")}
            placeholder="Doe"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
          />
          {errors.lastName && (
            <p id="lastName-error" className="text-sm text-destructive">
              {errors.lastName}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur?.("email")}
            placeholder="john.doe@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        {/* Sex Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="phone">
            Sex <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.phone}
            onValueChange={(value) => handleChange("phone", value)}
          >
            <SelectTrigger
              id="phone"
              aria-invalid={!!errors.phone}
              className={`w-full ${errors.phone ? "border-destructive" : ""}`}
            >
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="emale">Emale</SelectItem>
            </SelectContent>
          </Select>
          {errors.phone && (
            <p id="phone-error" className="text-sm text-destructive">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">
            Position Applying For <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.position}
            onValueChange={(value) => handleChange("position", value)}
          >
            <SelectTrigger
              id="position"
              aria-invalid={!!errors.position}
              className={`w-full ${errors.position ? "border-destructive" : ""}`}
            >
              <SelectValue placeholder="Select a position" />
            </SelectTrigger>
            <SelectContent>
              {JOB_POSITIONS.map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.position && (
            <p className="text-sm text-destructive">{errors.position}</p>
          )}
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label htmlFor="experienceLevel">
            Experience Level <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.experienceLevel}
            onValueChange={(value) => handleChange("experienceLevel", value)}
          >
            <SelectTrigger
              id="experienceLevel"
              aria-invalid={!!errors.experienceLevel}
              className={`w-full ${errors.experienceLevel ? "border-destructive" : ""}`}
            >
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.experienceLevel && (
            <p className="text-sm text-destructive">{errors.experienceLevel}</p>
          )}
        </div>

      </div>
    </div>
  );
}

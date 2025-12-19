import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Convenience components for common field types

interface TextFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  type?: "text" | "number" | "email" | "date" | "time";
  className?: string;
}

export function TextField({
  label,
  id,
  value,
  onChange,
  required = false,
  error,
  placeholder,
  type = "text",
  className,
}: TextFieldProps) {
  return (
    <FormField label={label} htmlFor={id} required={required} error={error} className={className}>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-1"
      />
    </FormField>
  );
}

interface TextAreaFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function TextAreaField({
  label,
  id,
  value,
  onChange,
  required = false,
  error,
  placeholder,
  rows = 3,
  className,
}: TextAreaFieldProps) {
  return (
    <FormField label={label} htmlFor={id} required={required} error={error} className={className}>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="mt-1"
      />
    </FormField>
  );
}

interface SelectFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
}

export function SelectField({
  label,
  id,
  value,
  onChange,
  options,
  required = false,
  error,
  placeholder = "Select...",
  className,
}: SelectFieldProps) {
  return (
    <FormField label={label} htmlFor={id} required={required} error={error} className={className}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="mt-1 w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

interface CheckboxFieldProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function CheckboxField({
  label,
  id,
  checked,
  onChange,
  className,
}: CheckboxFieldProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onChange(checked === true)}
      />
      <label
        htmlFor={id}
        className="text-sm font-medium text-zinc-900 dark:text-zinc-50 cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
}


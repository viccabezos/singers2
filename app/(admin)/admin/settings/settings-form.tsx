"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ChoirSettings } from "@/shared/types";
import { TextField } from "@/shared/ui/form-field";
import { TextAreaField } from "@/shared/ui/form-field";
import { FormLayout, FormSection, FormActions } from "@/shared/ui/form-layout";
import { updateSettings } from "./actions";

interface SettingsFormProps {
  initialSettings: ChoirSettings | null;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({
    tagline: initialSettings?.tagline || "",
    about_text: initialSettings?.about_text || "",
    facebook_url: initialSettings?.facebook_url || "",
    instagram_url: initialSettings?.instagram_url || "",
    youtube_url: initialSettings?.youtube_url || "",
    contact_email: initialSettings?.contact_email || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateUrl(url: string): boolean {
    if (!url) return true; // Empty is valid
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  function validateEmail(email: string): boolean {
    if (!email) return true; // Empty is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (formData.facebook_url && !validateUrl(formData.facebook_url)) {
      newErrors.facebook_url = "Please enter a valid URL";
    }
    if (formData.instagram_url && !validateUrl(formData.instagram_url)) {
      newErrors.instagram_url = "Please enter a valid URL";
    }
    if (formData.youtube_url && !validateUrl(formData.youtube_url)) {
      newErrors.youtube_url = "Please enter a valid URL";
    }
    if (formData.contact_email && !validateEmail(formData.contact_email)) {
      newErrors.contact_email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsPending(true);

    try {
      const result = await updateSettings(formData);

      if (result.success) {
        toast.success("Settings saved successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save settings");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error saving settings:", error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <FormLayout onSubmit={handleSubmit}>
      <FormSection title="Website Content">
        <TextField
          label="Tagline"
          id="tagline"
          value={formData.tagline}
          onChange={(value) => setFormData({ ...formData, tagline: value })}
          placeholder="Voices united in harmony, hearts connected through song"
        />

        <TextAreaField
          label="About Text"
          id="about_text"
          value={formData.about_text}
          onChange={(value) => setFormData({ ...formData, about_text: value })}
          placeholder="Tell visitors about your choir..."
          rows={8}
        />
      </FormSection>

      <FormSection title="Social Media">
        <TextField
          label="Facebook URL"
          id="facebook_url"
          value={formData.facebook_url}
          onChange={(value) => setFormData({ ...formData, facebook_url: value })}
          placeholder="https://facebook.com/yourchoir"
          error={errors.facebook_url}
        />

        <TextField
          label="Instagram URL"
          id="instagram_url"
          value={formData.instagram_url}
          onChange={(value) => setFormData({ ...formData, instagram_url: value })}
          placeholder="https://instagram.com/yourchoir"
          error={errors.instagram_url}
        />

        <TextField
          label="YouTube URL"
          id="youtube_url"
          value={formData.youtube_url}
          onChange={(value) => setFormData({ ...formData, youtube_url: value })}
          placeholder="https://youtube.com/@yourchoir"
          error={errors.youtube_url}
        />
      </FormSection>

      <FormSection title="Contact">
        <TextField
          label="Contact Email"
          id="contact_email"
          type="email"
          value={formData.contact_email}
          onChange={(value) => setFormData({ ...formData, contact_email: value })}
          placeholder="contact@leschanteurs.example"
          error={errors.contact_email}
        />
      </FormSection>

      <FormActions
        primaryLabel="Save Settings"
        onCancel={() => router.push("/admin/dashboard")}
        isPending={isPending}
      />
    </FormLayout>
  );
}

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UseFormFeedbackOptions {
  successMessage: string;
  successRedirect?: string;
  errorMessage: string;
  showInlineError?: boolean;
}

interface UseFormFeedbackResult {
  onSuccess: () => void;
  onError: (error: string) => void;
  inlineError: string | null;
  clearError: () => void;
}

export function useFormFeedback({
  successMessage,
  successRedirect,
  errorMessage,
  showInlineError = true,
}: UseFormFeedbackOptions): UseFormFeedbackResult {
  const router = useRouter();
  const [inlineError, setInlineError] = useState<string | null>(null);

  const onSuccess = useCallback(() => {
    toast.success(successMessage);
    if (successRedirect) {
      router.push(successRedirect);
      router.refresh();
    }
  }, [successMessage, successRedirect, router]);

  const onError = useCallback(
    (error: string) => {
      toast.error(errorMessage, {
        description: error,
      });
      if (showInlineError) {
        setInlineError(error);
      }
    },
    [errorMessage, showInlineError]
  );

  const clearError = useCallback(() => {
    setInlineError(null);
  }, []);

  return {
    onSuccess,
    onError,
    inlineError,
    clearError,
  };
}


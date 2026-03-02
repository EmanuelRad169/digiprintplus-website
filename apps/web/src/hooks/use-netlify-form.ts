import { useState, useCallback } from "react";

/**
 * Options for Netlify form submission
 */
interface UseNetlifyFormOptions<T> {
  formName: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  /**
   * If true, enables honeypot field 'bot-field'. Defaults to true.
   */
  enableHoneypot?: boolean;
}

/**
 * Hook to manage Netlify Forms submission in React
 */
export function useNetlifyForm<T extends Record<string, any>>({
  formName,
  onSuccess,
  onError,
  enableHoneypot = true,
}: UseNetlifyFormOptions<T>) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const encode = (data: Record<string, any>): string => {
    return Object.keys(data)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]),
      )
      .join("&");
  };

  /**
   * Submit form data to Netlify
   * Handles both standard objects and FormData (for file uploads)
   */
  const submit = useCallback(
    async (data: T | FormData) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        let body: string | FormData;
        const headers: Record<string, string> = {
          "Content-Type": "application/x-www-form-urlencoded",
        };

        if (data instanceof FormData) {
          // If FormData, let the browser set the Content-Type header (for multipart boundary)
          delete headers["Content-Type"];
          data.append("form-name", formName);
          if (enableHoneypot && !data.has("bot-field")) {
            data.append("bot-field", "");
          }
          body = data;
        } else {
          // Standard URL encoded submission
          const payload = {
            "form-name": formName,
            ...(enableHoneypot ? { "bot-field": "" } : {}),
            ...data,
          };
          body = encode(payload);
        }

        const response = await fetch("/", {
          method: "POST",
          headers: headers as HeadersInit,
          body: body,
        });

        if (!response.ok) {
          throw new Error(
            `Submission failed with status ${response.status}: ${response.statusText}`,
          );
        }

        setSuccess(true);
        if (onSuccess) onSuccess();
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
        setError(message);
        if (onError && err instanceof Error) onError(err);
      } finally {
        setLoading(false);
      }
    },
    [formName, enableHoneypot, onSuccess, onError],
  );

  const reset = useCallback(() => {
    setSuccess(false);
    setError(null);
    setLoading(false);
  }, []);

  return {
    submit,
    success,
    error,
    loading,
    reset,
    formName,
    /**
     * Props to spread onto the honeypot input if not using hidden inputs manually
     */
    honeypotProps: {
      name: "bot-field",
      style: { display: "none" },
    },
  };
}

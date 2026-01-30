"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError } from "react-hook-form";
import { CheckCircle } from "lucide-react";

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  company: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms of Service and Privacy Policy",
  }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const FORM_NAME = "contact";

function encodeNetlifyForm(data: Record<string, string>) {
  return Object.keys(data)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(data[key] ?? "")}`,
    )
    .join("&");
}

export function ContactForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ContactFormData>({ resolver: zodResolver(contactFormSchema) });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const payload: Record<string, string> = {
        "form-name": FORM_NAME,
        "bot-field": "",
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        company: data.company || "",
        message: data.message,
        agreeToTerms: data.agreeToTerms ? "yes" : "no",
      };

      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encodeNetlifyForm(payload),
      });

      if (!response.ok) {
        throw new Error("Submission failed. Please try again.");
      }

      setSubmitSuccess(true);
      router.push(`/forms/success?form=${encodeURIComponent(FORM_NAME)}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  const renderError = (error: FieldError | undefined) => {
    return error ? (
      <p className="text-red-500 text-sm mt-1">{error.message}</p>
    ) : null;
  };

  return (
    <form
      name={FORM_NAME}
      method="POST"
      action={`/forms/success?form=${encodeURIComponent(FORM_NAME)}`}
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p className="hidden">
        <label>
          Don’t fill this out if you’re human: <input name="bot-field" />
        </label>
      </p>

      {submitError && (
        <div className="rounded-lg border border-magenta-200 bg-magenta-50 p-4 text-sm text-magenta-800">
          {submitError}
        </div>
      )}

      {submitSuccess && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Message sent successfully.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            {...register("firstName")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-500 focus:border-transparent transition-colors duration-200"
            placeholder="John"
            required
          />
          {renderError(errors.firstName)}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            {...register("lastName")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-500 focus:border-transparent transition-colors duration-200"
            placeholder="Doe"
            required
          />
          {renderError(errors.lastName)}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-500 focus:border-transparent transition-colors duration-200"
            placeholder="john@example.com"
            required
          />
          {renderError(errors.email)}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            {...register("phone")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-500 focus:border-transparent transition-colors duration-200"
            placeholder="Your phone number"
            required
          />
          {renderError(errors.phone)}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Company Name
          </label>
          <input
            type="text"
            id="company"
            {...register("company")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-500 focus:border-transparent transition-colors duration-200"
            placeholder="Your Company LLC"
          />
          {renderError(errors.company)}
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Message *
        </label>
        <textarea
          id="message"
          {...register("message")}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-500 focus:border-transparent transition-colors duration-200 resize-none"
          placeholder="Tell us about your project requirements..."
          required
        />
        {renderError(errors.message)}
      </div>

      {/* Terms and Privacy Policy */}
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="agreeToTerms"
          {...register("agreeToTerms")}
          className="mt-1 h-4 w-4 text-magenta-600 focus:ring-magenta-500 border-gray-300 rounded"
        />
        <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
          I agree to the{" "}
          <a
            href="/terms"
            className="text-magenta-600 hover:text-magenta-700 underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-magenta-600 hover:text-magenta-700 underline"
          >
            Privacy Policy
          </a>
          *
        </label>
      </div>
      {renderError(errors.agreeToTerms)}

      {/* Privacy Note */}
      <div className="bg-magenta-50 p-4 rounded-lg">
        <p className="text-sm text-magenta-800">
          <strong>Privacy Note:</strong> Your information is secure and will
          only be used to respond to your inquiry and provide relevant
          information about our services.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-magenta-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-magenta-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Sending...
          </div>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}

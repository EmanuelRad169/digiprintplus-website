"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Loader2, CheckCircle, XCircle, X } from "lucide-react";

const customDesignSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  phone: z.string().optional(),
  projectType: z.string().min(1, "Please specify the project type"),
  description: z
    .string()
    .min(10, "Please provide at least 10 characters description"),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

type CustomDesignFormData = z.infer<typeof customDesignSchema>;

const FORM_NAME = "custom-design-request";

function encodeNetlifyForm(data: Record<string, string>) {
  return Object.keys(data)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(data[key] ?? "")}`,
    )
    .join("&");
}

interface RequestCustomDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestCustomDesignModal({
  isOpen,
  onClose,
}: RequestCustomDesignModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomDesignFormData>({
    resolver: zodResolver(customDesignSchema),
  });

  const onSubmit = async (data: CustomDesignFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const payload: Record<string, string> = {
        "form-name": FORM_NAME,
        "bot-field": "",
        name: data.name,
        email: data.email,
        company: data.company || "",
        phone: data.phone || "",
        projectType: data.projectType,
        description: data.description,
        budget: data.budget || "",
        timeline: data.timeline || "",
      };

      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encodeNetlifyForm(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send request");
      }

      setSubmitStatus("success");
      reset();

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitStatus("idle");
      }, 2000);
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSubmitStatus("idle");
      setErrorMessage("");
      reset();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-full overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Request Custom Design
              </h2>
              <p className="text-gray-600 mt-1">
                Tell us about your project and we&apos;ll get back to you with a
                custom quote within 24 hours.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              disabled={isSubmitting}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitStatus === "success" && (
            <div className="flex items-center justify-center p-6 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div className="text-center">
                <h3 className="text-lg font-medium text-green-900">
                  Request Sent!
                </h3>
                <p className="text-green-700">
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="flex items-center p-4 bg-magenta-50 rounded-lg mb-6">
              <XCircle className="h-6 w-6 text-magenta-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-magenta-900">
                  Error sending request
                </h3>
                <p className="text-magenta-700 text-sm">{errorMessage}</p>
              </div>
            </div>
          )}

          {submitStatus !== "success" && (
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
                  Don’t fill this out if you’re human:{" "}
                  <input name="bot-field" />
                </label>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Name *
                  </label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Your full name"
                    className={errors.name ? "border-magenta-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-magenta-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="your@email.com"
                    className={errors.email ? "border-magenta-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-magenta-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="company"
                    className="text-sm font-medium text-gray-700"
                  >
                    Company
                  </label>
                  <Input
                    id="company"
                    {...register("company")}
                    placeholder="Your company name"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="projectType"
                  className="text-sm font-medium text-gray-700"
                >
                  Project Type *
                </label>
                <Input
                  id="projectType"
                  {...register("projectType")}
                  placeholder="e.g., Business Cards, Brochures, Banners, etc."
                  className={errors.projectType ? "border-magenta-500" : ""}
                />
                {errors.projectType && (
                  <p className="text-sm text-magenta-600">
                    {errors.projectType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Project Description *
                </label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Please describe your project in detail. Include any specific requirements, style preferences, dimensions, colors, etc."
                  rows={4}
                  className={errors.description ? "border-magenta-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-magenta-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="budget"
                    className="text-sm font-medium text-gray-700"
                  >
                    Budget Range
                  </label>
                  <Input
                    id="budget"
                    {...register("budget")}
                    placeholder="e.g., $500-$1000"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="timeline"
                    className="text-sm font-medium text-gray-700"
                  >
                    Timeline
                  </label>
                  <Input
                    id="timeline"
                    {...register("timeline")}
                    placeholder="e.g., 2 weeks, ASAP, etc."
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="sm:order-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-magenta-500 hover:bg-magenta-600 text-white sm:order-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Request"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError } from "react-hook-form";

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactFormSchema) });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null);
    try {
      const payload: Record<string, string> = {
        "form-name": FORM_NAME,
        "bot-field": "",
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || "",
        message: data.message,
      };

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeNetlifyForm(payload),
      });

      if (!response.ok) {
        throw new Error("Submission failed. Please try again.");
      }

      if (typeof window !== "undefined") {
        window.location.href = `/forms/success?form=${encodeURIComponent(FORM_NAME)}`;
      }
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="relative">
          <input
            id="firstName"
            type="text"
            {...register("firstName")}
            className="peer h-12 w-full rounded-xl border border-blue-gray-200 bg-transparent px-4 py-3 font-sans text-sm font-normal text-blue-gray-700 outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-magenta-500 focus:outline-0"
            placeholder=" "
          />
          <label
            htmlFor="firstName"
            className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-medium leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-magenta-500 after:transition-transform peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-magenta-500 peer-focus:after:scale-x-100 peer-focus:after:border-magenta-500 ml-4"
          >
            First name
          </label>
          {renderError(errors.firstName)}
        </div>

        <div className="relative">
          <input
            id="lastName"
            type="text"
            {...register("lastName")}
            className="peer h-12 w-full rounded-xl border border-blue-gray-200 bg-transparent px-4 py-3 font-sans text-sm font-normal text-blue-gray-700 outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-magenta-500 focus:outline-0"
            placeholder=" "
          />
          <label
            htmlFor="lastName"
            className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-medium leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-magenta-500 after:transition-transform peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-magenta-500 peer-focus:after:scale-x-100 peer-focus:after:border-magenta-500 ml-4"
          >
            Last name
          </label>
          {renderError(errors.lastName)}
        </div>
      </div>
      <div className="relative">
        <input
          id="email"
          type="email"
          {...register("email")}
          className="peer h-12 w-full rounded-xl border border-blue-gray-200 bg-transparent px-4 py-3 font-sans text-sm font-normal text-blue-gray-700 outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-magenta-500 focus:outline-0"
          placeholder=" "
        />
        <label
          htmlFor="email"
          className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-medium leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-magenta-500 after:transition-transform peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-magenta-500 peer-focus:after:scale-x-100 peer-focus:after:border-magenta-500 ml-4"
        >
          Email
        </label>
        {renderError(errors.email)}
      </div>

      <div className="relative">
        <input
          id="phone"
          type="tel"
          {...register("phone")}
          className="peer h-12 w-full rounded-xl border border-blue-gray-200 bg-transparent px-4 py-3 font-sans text-sm font-normal text-blue-gray-700 outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-magenta-500 focus:outline-0"
          placeholder=" "
        />
        <label
          htmlFor="phone"
          className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-medium leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-magenta-500 after:transition-transform peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-magenta-500 peer-focus:after:scale-x-100 peer-focus:after:border-magenta-500 ml-4"
        >
          Phone number
        </label>
      </div>

      <div className="relative">
        <textarea
          id="message"
          {...register("message")}
          className="peer h-32 w-full rounded-xl border border-blue-gray-200 bg-transparent px-4 py-3 font-sans text-sm font-normal text-blue-gray-700 outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-magenta-500 focus:outline-0 resize-none"
          placeholder=" "
        ></textarea>
        <label
          htmlFor="message"
          className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-medium leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-magenta-500 after:transition-transform peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-magenta-500 peer-focus:after:scale-x-100 peer-focus:after:border-magenta-500 ml-4"
        >
          Message
        </label>
        {renderError(errors.message)}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-magenta-500 text-white px-6 py-3.5 rounded-xl hover:shadow-lg active:shadow-md transition-all duration-300 font-medium tracking-wide shadow-md flex justify-center items-center"
      >
        {isSubmitting ? (
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );
}

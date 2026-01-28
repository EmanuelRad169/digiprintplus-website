"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError } from "react-hook-form";
import { Shield, CheckCircle } from "lucide-react";

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

export function ContactForm() {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState({
    question: "",
    answer: 0,
  });
  const [userCaptchaAnswer, setUserCaptchaAnswer] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ContactFormData>({ resolver: zodResolver(contactFormSchema) });

  // Generate simple math CAPTCHA
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = Math.random() > 0.5 ? "+" : "-";
    const answer =
      operation === "+"
        ? num1 + num2
        : Math.max(num1, num2) - Math.min(num1, num2);

    setCaptchaQuestion({
      question: `${Math.max(num1, num2)} ${operation} ${Math.min(num1, num2)} = ?`,
      answer: answer,
    });
    setShowCaptcha(true);
    setCaptchaVerified(false);
  };

  const verifyCaptcha = () => {
    if (parseInt(userCaptchaAnswer) === captchaQuestion.answer) {
      setCaptchaVerified(true);
      setShowCaptcha(false);
    } else {
      alert("Incorrect answer. Please try again.");
      generateCaptcha();
      setUserCaptchaAnswer("");
    }
  };

  const onSubmit = (data: ContactFormData) => {
    if (!captchaVerified) {
      generateCaptcha();
      return;
    }

    // TODO: Implement form submission logic
    console.log("Form submitted:", data);
    // Send data to API endpoint for processing
  };

  const renderError = (error: FieldError | undefined) => {
    return error ? (
      <p className="text-red-500 text-sm mt-1">{error.message}</p>
    ) : null;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      {/* CAPTCHA */}
      {showCaptcha && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-4">
            <Shield className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security Check: {captchaQuestion.question}
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={userCaptchaAnswer}
                  onChange={(e) => setUserCaptchaAnswer(e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-500 focus:border-transparent"
                  placeholder="Answer"
                />
                <button
                  type="button"
                  onClick={verifyCaptcha}
                  className="px-4 py-2 bg-magenta-600 text-white rounded-lg hover:bg-magenta-700 transition-colors"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {captchaVerified && (
        <div className="flex items-center space-x-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">
            Security verification completed
          </span>
        </div>
      )}

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

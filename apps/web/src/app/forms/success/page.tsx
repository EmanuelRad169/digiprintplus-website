"use client";

import { useSearchParams } from "next/navigation";

export default function FormsSuccessPage() {
  const searchParams = useSearchParams();
  const form = searchParams.get("form");

  return (
    <div className="min-h-[70vh] bg-gray-50 py-16">
      <div className="container max-w-2xl">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Thanks!</h1>
          <p className="mt-3 text-gray-600">
            Your <span className="font-semibold">{form || "form"}</span>{" "}
            submission was received.
          </p>
          <p className="mt-2 text-gray-600">
            We’ll review it and get back to you shortly.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-magenta-600 text-white font-medium hover:bg-magenta-700 transition-colors"
            >
              Back to Home
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Contact Us
            </a>
          </div>

          <p className="mt-8 text-xs text-gray-500">
            If you don’t hear back, please check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}

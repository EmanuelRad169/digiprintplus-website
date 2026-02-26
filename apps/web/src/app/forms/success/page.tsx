"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function FormsSuccessPage() {
  const searchParams = useSearchParams();
  const form = searchParams.get("form");
  const requestId = searchParams.get("requestId");

  return (
    <div className="min-h-[70vh] bg-gray-50 py-16">
      <div className="container max-w-2xl">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">Thank You!</h1>
          <p className="mt-3 text-gray-600">
            Your <span className="font-semibold">{form || "form"}</span>{" "}
            submission was received successfully.
          </p>

          {requestId && (
            <div className="mt-4 p-3 bg-magenta-50 rounded-lg">
              <p className="text-sm text-magenta-800">
                <span className="font-semibold">Request ID:</span> {requestId}
              </p>
              <p className="text-xs text-magenta-600 mt-1">
                Please save this ID for your records
              </p>
            </div>
          )}

          <p className="mt-4 text-gray-600">
            We&apos;ll review your request and get back to you within 24 hours.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-magenta-600 text-white font-medium hover:bg-magenta-700 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>

          <p className="mt-8 text-xs text-gray-500">
            If you don’t hear back, please check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}

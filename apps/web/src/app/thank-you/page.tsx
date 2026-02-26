"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Phone, Mail, Clock } from "lucide-react";
import { useSiteSettings } from "../../hooks/useSiteSettings";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const quoteId = searchParams?.get("quote");
  const { siteSettings } = useSiteSettings();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="container max-w-4xl">
        <div
          className={`bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center transition-all duration-600 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          {/* Success Icon */}
          <div
            className={`w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 transition-all duration-600 delay-300 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Main Message */}
          <div
            className={`space-y-6 mb-12 transition-all duration-600 delay-400 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Thank You!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your quote request has been successfully submitted. We&apos;re
              excited to help bring your printing project to life!
            </p>
            {quoteId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-blue-800 font-medium">
                  Quote Request ID: <span className="font-mono">{quoteId}</span>
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  Please save this ID for your records.
                </p>
              </div>
            )}
          </div>

          {/* What's Next */}
          <div
            className={`bg-primary-50 rounded-xl p-8 mb-12 transition-all duration-600 delay-600 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-2xl font-bold text-primary-900 mb-6">
              What Happens Next?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">
                    Confirmation Email
                  </h3>
                  <p className="text-sm text-primary-700">
                    Check your inbox for an immediate confirmation with your
                    quote request details.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">
                    Expert Review
                  </h3>
                  <p className="text-sm text-primary-700">
                    Our specialists will carefully review your requirements and
                    prepare a detailed quote.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">
                    Personal Contact
                  </h3>
                  <p className="text-sm text-primary-700">
                    We&apos;ll call or email you within 24 hours with your
                    custom quote and next steps.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div
            className={`border-t border-gray-200 pt-8 transition-all duration-600 delay-800 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Need Immediate Assistance?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {siteSettings?.contact?.phone && (
                <a
                  href={`tel:${siteSettings.contact.phone.replace(/\D/g, "")}`}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">
                    {siteSettings.contact.phone}
                  </span>
                </a>
              )}

              <div className="hidden sm:block text-gray-300">|</div>

              <a
                href="mailto:sales@digiprintplus.com"
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">sales@digiprintplus.com</span>
              </a>

              <div className="hidden sm:block text-gray-300">|</div>

              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="text-sm">Mon-Fri: 8AM-6PM</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mt-12 transition-all duration-600 delay-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Browse More Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Return to Home
            </Link>
          </div>

          {/* Reference Number */}
          <div
            className={`mt-8 text-sm text-gray-500 transition-opacity duration-600 delay-1200 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Reference #: QR-{Date.now().toString().slice(-6)}
          </div>
        </div>
      </div>
    </div>
  );
}

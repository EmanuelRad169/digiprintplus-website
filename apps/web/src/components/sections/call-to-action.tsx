"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { useSiteSettings } from "../../hooks/useSiteSettings";

export function CallToAction() {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const { siteSettings } = useSiteSettings();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1, rootMargin: "-100px" },
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section
      ref={ref}
      className="py-20 bg-magenta-500 text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative">
        <div
          className={`text-center max-w-4xl mx-auto transition-all duration-800 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 transition-all duration-600 delay-200 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Ready to Get Started?
          </h2>

          <p
            className={`text-xl text-magenta-100 mb-8 leading-relaxed transition-all duration-600 delay-300 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Join thousands of satisfied customers who trust DigiPrintPlus for
            their printing needs. Get your instant quote today and experience
            the difference quality makes.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-600 delay-400 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Link
              href="/quote"
              className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-lg  transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Your Free Quote
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>

            {siteSettings?.contact?.phone && (
              <Link
                href={`tel:${siteSettings.contact.phone.replace(/\D/g, "")}`}
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-200"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call {siteSettings.contact.phone}
              </Link>
            )}
          </div>

          <div
            className={`mt-8 text-magenta-100 transition-all duration-600 delay-600 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-base">
              <strong>Rush Orders Available</strong> •{" "}
              <strong>Expert Support</strong> •{" "}
              <strong>Satisfaction Guaranteed</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

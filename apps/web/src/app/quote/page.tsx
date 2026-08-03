"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Upload,
  User,
  FileText,
  Send,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  getProductForQuote,
  getQuoteSettings,
  QuoteProductContext,
  QuoteSettings,
} from "../../lib/sanity/contentFetchers";
import {
  readBasket,
  clearBasket,
  type BasketItem,
} from "../../lib/quote-basket";
import {
  makeLineItem,
  type QuoteLineItem,
} from "../../components/quote/job-specs-step";
import { useNetlifyForm } from "../../hooks/use-netlify-form";
import { NETLIFY_FORMS } from "../../lib/netlify/form-config";

// Dynamic imports for quote step components
const ContactStep = dynamic(
  () =>
    import("../../components/quote/contact-step").then((mod) => ({
      default: mod.ContactStep,
    })),
  { ssr: false },
);
const JobSpecsStep = dynamic(
  () =>
    import("../../components/quote/job-specs-step").then((mod) => ({
      default: mod.JobSpecsStep,
    })),
  { ssr: false },
);
const FileUploadStep = dynamic(
  () =>
    import("../../components/quote/file-upload-step").then((mod) => ({
      default: mod.FileUploadStep,
    })),
  { ssr: false },
);
const ReviewStep = dynamic(
  () =>
    import("../../components/quote/review-step").then((mod) => ({
      default: mod.ReviewStep,
    })),
  { ssr: false },
);

const FORM_NAME = NETLIFY_FORMS.QUOTE;

// Copy of last resort. Every one of these strings is editable in the Studio
// under Quote Form Settings; these values only apply if that document is
// missing or has not loaded yet.
const FALLBACK_STEPS = [
  { name: "Contact Info", description: "Your contact details" },
  { name: "Job Specifications", description: "Project requirements" },
  { name: "File Upload", description: "Upload your files" },
  { name: "Review & Submit", description: "Review and submit" },
];

const FALLBACK_HERO = {
  title: "Get Your",
  titleAccent: "Free Quote",
  subtitle:
    "Tell us about your project and we'll provide a detailed quote within 24 hours",
  productEyebrow: "Product Quote",
  productTitlePrefix: "Request a Quote for",
  productSubtitleSingle:
    "We'll price this exact product for you and reply within 24 hours",
  productSubtitleMultiple:
    "We'll price all {count} products together and reply within 24 hours",
};

const FALLBACK_BUTTONS = {
  next: "Next",
  previous: "Previous",
  submit: "Submit Quote Request",
};

const STEP_ICONS = [User, FileText, Upload, Send];

function buildSteps(settings: QuoteSettings | null) {
  const fromSettings = [
    settings?.contactStep,
    settings?.jobSpecsStep,
    settings?.fileUploadStep,
    settings?.reviewStep,
  ];
  return FALLBACK_STEPS.map((fallback, i) => ({
    id: i + 1,
    icon: STEP_ICONS[i],
    name: fromSettings[i]?.title || fallback.name,
    description: fromSettings[i]?.description || fallback.description,
  }));
}

export default function QuotePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [lockedProduct, setLockedProduct] =
    useState<QuoteProductContext | null>(null);
  const [productLoading, setProductLoading] = useState(false);
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const formTopRef = useRef<HTMLDivElement>(null);
  const [quoteSettings, setQuoteSettings] = useState<QuoteSettings | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    getQuoteSettings()
      .then((settings) => {
        if (!cancelled) setQuoteSettings(settings);
      })
      .catch((err) => {
        console.error("Failed to load quote settings:", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const steps = useMemo(() => buildSteps(quoteSettings), [quoteSettings]);
  const buttonText = {
    ...FALLBACK_BUTTONS,
    ...(quoteSettings?.buttonText || {}),
  };
  const heroCopy = { ...FALLBACK_HERO, ...(quoteSettings?.hero || {}) };

  const [formData, setFormData] = useState({
    // Contact Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",

    // Job Specs — an array: one quote can cover several products.
    lineItems: [] as QuoteLineItem[],
    turnaround: "",
    additionalNotes: "",

    // Files
    files: [] as File[],

    // Options
    needsDesignAssistance: false,
    agreeToTerms: false,
  });

  const {
    submit: submitToNetlify,
    loading: isSubmitting,
    error: submitError,
    reset,
  } = useNetlifyForm({
    formName: FORM_NAME,
    onSuccess: () => {
      // Track conversion
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "quote_submit", {
          event_category: "engagement",
          event_label: (formData.lineItems || [])
            .map((i: QuoteLineItem) => i.productType)
            .filter(Boolean)
            .join(", "),
          value: formData.lineItems?.length || 1,
        });
      }
      clearBasket();
      setTimeout(() => {
        router.push(`/forms/success?form=${encodeURIComponent(FORM_NAME)}`);
      }, 500);
    },
  });

  // Seed the line items from the quote basket (products collected via
  // "Add to quote") plus any ?product= slug. Looking the product up beats
  // title-casing the slug: a guessed string like "Saddle Stitched Booklets"
  // matches no <option>, so the old pre-fill silently vanished.
  useEffect(() => {
    let cancelled = false;
    const slug = searchParams?.get("product");
    const basket = readBasket();

    const seed = async () => {
      const fromBasket: QuoteLineItem[] = basket.map((b) =>
        makeLineItem({
          productType: b.title,
          productSlug: b.slug,
          categoryTitle: b.categoryTitle,
          locked: true,
        }),
      );

      let headline: QuoteProductContext | null = null;
      if (slug) {
        setProductLoading(true);
        headline = await getProductForQuote(slug).finally(() => {
          if (!cancelled) setProductLoading(false);
        });
      }

      if (cancelled) return;

      const items = [...fromBasket];
      if (headline && !items.some((i) => i.productSlug === headline!.slug)) {
        items.unshift(
          makeLineItem({
            productType: headline.title,
            productSlug: headline.slug,
            categoryTitle: headline.categoryTitle,
            locked: true,
          }),
        );
      }

      setLockedProduct(headline);
      setBasketItems(basket);
      if (items.length) {
        setFormData((prev) => ({ ...prev, lineItems: items }));
      }
    };

    seed();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  // Bring the form back into view on step change instead of leaving the user
  // stranded halfway down a long step.
  const goToStep = (step: number) => {
    setCurrentStep(step);
    setStepError(null);
    setMaxStepReached((prev) => Math.max(prev, step));
    requestAnimationFrame(() => {
      formTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const nextStep = () => {
    const error = validateStep(currentStep);
    if (error) {
      setStepError(error.message);
      if (error.field) {
        const el = document.getElementById(error.field) as HTMLElement | null;
        el?.focus({ preventScroll: false });
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    if (currentStep < steps.length) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    if (stepError) setStepError(null);
  };

  // Returns the first problem on a step as { field, message } so the banner can
  // say what is wrong AND we can move focus to the offending input.
  const validateStep = useCallback(
    (step: number): { field: string | null; message: string } | null => {
      const req = (value: string, field: string, message: string) =>
        value.trim() ? null : { field, message };

      if (step === 1) {
        const missing =
          req(
            formData.firstName,
            "firstName",
            "Please enter your first name.",
          ) ||
          req(formData.lastName, "lastName", "Please enter your last name.") ||
          req(formData.email, "email", "Please enter your email address.") ||
          req(formData.phone, "phone", "Please enter your phone number.");
        if (missing) return missing;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email.trim())) {
          return {
            field: "email",
            message: "That email address doesn't look right — please check it.",
          };
        }
        if (formData.phone.replace(/\D/g, "").length < 10) {
          return {
            field: "phone",
            message: "Please enter a phone number with at least 10 digits.",
          };
        }
      }

      if (step === 2) {
        const items: QuoteLineItem[] = formData.lineItems || [];
        if (items.length === 0) {
          return { field: null, message: "Please add at least one product." };
        }
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const label = item.productType || `product ${i + 1}`;
          if (!item.productType.trim()) {
            return {
              field: `productType-${item.id}`,
              message: `Please choose a product type for product ${i + 1}.`,
            };
          }
          if (!item.quantity.trim()) {
            return {
              field: `quantity-${item.id}`,
              message: `Please choose a quantity for ${label}.`,
            };
          }
        }
        const missing = req(
          formData.turnaround,
          "turnaround",
          "Please choose a turnaround time.",
        );
        if (missing) return missing;
      }

      if (step === 3) {
        if (!formData.needsDesignAssistance && formData.files.length === 0) {
          return {
            field: null,
            message:
              "Add at least one PDF, or tick \u201cI don\u2019t have files ready yet\u201d to continue.",
          };
        }
      }

      if (step === 4) {
        if (!formData.agreeToTerms) {
          return {
            field: "agreeToTerms",
            message: "Please agree to the terms before submitting.",
          };
        }
      }

      return null;
    },
    [formData],
  );

  const syncInputFiles = (files: File[]) => {
    if (!fileInputRef.current) return;
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    fileInputRef.current.files = dataTransfer.files;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const invalidFiles = files.filter(
      (file) =>
        !file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf"),
    );
    if (invalidFiles.length > 0) {
      setStepError(
        `Please upload PDF files only. Invalid files: ${invalidFiles.map((f) => f.name).join(", ")}`,
      );
      return;
    }
    const nextFiles = [...formData.files, ...files];
    updateFormData({ files: nextFiles });
    syncInputFiles(nextFiles);
    setStepError(null);
  };

  const removeFile = (index: number) => {
    const newFiles = formData.files.filter((_, i) => i !== index);
    updateFormData({ files: newFiles });
    syncInputFiles(newFiles);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateStep(4);
    if (error) {
      setStepError(error.message);
      if (error.field) {
        document.getElementById(error.field)?.focus();
      }
      return;
    }

    reset();
    setStepError(null);

    // Prepare FormData
    const items: QuoteLineItem[] = formData.lineItems || [];
    const subjectProducts =
      items.length > 1
        ? `${items[0]?.productType || "Custom"} +${items.length - 1} more`
        : items[0]?.productType || "Custom";

    const submissionData = new FormData();
    submissionData.append(
      "subject",
      `New Quote Request - ${subjectProducts} from ${formData.firstName} ${formData.lastName}`,
    );

    // Append text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (
        key === "files" ||
        key === "lineItems" ||
        key === "agreeToTerms" ||
        key === "needsDesignAssistance"
      )
        return;
      submissionData.append(key, String(value || ""));
    });

    // Line items go over the wire two ways: JSON for machine consumers (the
    // Sanity route builds jobSpecs[] from this) and a flat readable summary so
    // the Netlify Forms inbox is not a wall of JSON.
    submissionData.append("lineItems", JSON.stringify(items));
    submissionData.append("itemCount", String(items.length));
    submissionData.append(
      "productSummary",
      items
        .map(
          (it, i) =>
            `${i + 1}. ${it.productType}${it.quantity ? ` x${it.quantity}` : ""}` +
            `${it.size ? `, ${it.size}` : ""}${it.paperType ? `, ${it.paperType}` : ""}` +
            `${it.finish ? `, ${it.finish}` : ""}` +
            `${it.additionalNotes ? ` — ${it.additionalNotes}` : ""}`,
        )
        .join("\n"),
    );

    // Append checkboxes
    submissionData.append(
      "agreeToTerms",
      formData.agreeToTerms ? "true" : "false",
    );
    submissionData.append(
      "needsDesignAssistance",
      formData.needsDesignAssistance ? "true" : "false",
    );

    // Append files
    if (formData.files && formData.files.length > 0) {
      formData.files.forEach((file) => {
        submissionData.append("files", file);
      });
    }

    // Two destinations, deliberately.
    //
    // Sanity is the system of record — it is what the Studio quote pipeline
    // reads. Netlify Forms is the safety net: it captures the raw submission
    // (including file attachments) even if Sanity is unreachable, so a lead is
    // never silently lost. We fire Sanity first but never let its failure block
    // the customer: they have done their part, and the Netlify capture means
    // the request still reaches the business.
    try {
      const res = await fetch("/api/submit-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          turnaround: formData.turnaround,
          additionalNotes: formData.additionalNotes,
          needsDesignAssistance: formData.needsDesignAssistance,
          lineItems: items,
          fileCount: formData.files?.length || 0,
        }),
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        console.error("Quote request did not reach Sanity:", detail);
      }
    } catch (error) {
      console.error("Quote request did not reach Sanity:", error);
    }

    await submitToNetlify(submissionData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ContactStep formData={formData} updateFormData={updateFormData} />
        );
      case 2:
        return (
          <JobSpecsStep formData={formData} updateFormData={updateFormData} />
        );
      case 3:
        return (
          <FileUploadStep
            formData={formData}
            updateFormData={updateFormData}
            fileInputRef={fileInputRef}
            onRemoveFile={removeFile}
          />
        );
      case 4:
        return (
          <ReviewStep formData={formData} updateFormData={updateFormData} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {lockedProduct ? (
            <>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-magenta-600">
                {heroCopy.productEyebrow}
              </p>
              <h1 className="mb-4 text-4xl font-bold text-gray-900">
                {heroCopy.productTitlePrefix}{" "}
                <span className="text-magenta-600">{lockedProduct.title}</span>
              </h1>
              <p className="text-xl text-gray-600">
                {basketItems.length > 1
                  ? heroCopy.productSubtitleMultiple.replace(
                      "{count}",
                      String(basketItems.length),
                    )
                  : heroCopy.productSubtitleSingle}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {heroCopy.title}{" "}
                <span className="text-magenta-600">{heroCopy.titleAccent}</span>
              </h1>
              <p className="text-xl text-gray-600">{heroCopy.subtitle}</p>
            </>
          )}
        </motion.div>

        {/* Product context bar — proof the product carried over, plus an exit
            for anyone who clicked through on the wrong item. */}
        {lockedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-8 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
          >
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
              {lockedProduct.imageUrl ? (
                <Image
                  src={lockedProduct.imageUrl}
                  alt={lockedProduct.title}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                You&#39;re quoting
              </p>
              <p className="truncate text-lg font-bold text-gray-900">
                {lockedProduct.title}
              </p>
              {lockedProduct.categoryTitle && (
                <p className="text-sm text-gray-500">
                  {lockedProduct.categoryTitle}
                </p>
              )}
            </div>

            <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
              <Link
                href={`/products/${lockedProduct.slug}`}
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                View product
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-magenta-600 transition-colors hover:bg-magenta-50"
              >
                Quote something else
              </Link>
            </div>
          </motion.div>
        )}

        {/* Form Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white border border-gray-300 rounded-2xl shadow-lg p-6 sm:p-8 scroll-mt-28"
          ref={formTopRef}
        >
          <form
            name={FORM_NAME}
            method="POST"
            action={`/forms/success?form=${encodeURIComponent(FORM_NAME)}`}
            data-netlify="true"
            netlify-honeypot="bot-field"
            encType="multipart/form-data"
            onSubmit={handleFormSubmit}
          >
            <input type="hidden" name="form-name" value={FORM_NAME} />
            <input
              type="hidden"
              name="productSlugs"
              value={(formData.lineItems || [])
                .map((i: QuoteLineItem) => i.productSlug)
                .filter(Boolean)
                .join(",")}
            />
            <input
              ref={fileInputRef}
              type="file"
              name="files"
              multiple
              accept=".pdf,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <p className="hidden">
              <label>
                Don’t fill this out if you’re human: <input name="bot-field" />
              </label>
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {(stepError || submitError) && (
              <div
                role="alert"
                aria-live="assertive"
                className="mt-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{stepError || String(submitError)}</span>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  currentStep === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                {buttonText.previous}
              </button>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-6 py-3 bg-magenta-600 text-white rounded-lg font-medium hover:bg-magenta-700 transition-colors duration-200"
                >
                  {buttonText.next}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-6 py-3 bg-magenta-600 text-white rounded-lg font-medium hover:bg-magenta-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : buttonText.submit}
                  <Send className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10"
        >
          {/* Mobile: a compact bar. Four icon circles plus labels do not fit
              on a phone, and a squeezed stepper reads as broken. */}
          <div className="sm:hidden">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">
                {steps[currentStep - 1].name}
              </span>
              <span className="text-xs font-medium text-gray-500">
                Step {currentStep} of {steps.length}
              </span>
            </div>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={steps.length}
              aria-valuenow={currentStep}
              aria-label="Quote request progress"
            >
              <div
                className="h-full rounded-full bg-magenta-600 transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop: completed steps are clickable so people can go back and
              correct an answer without clicking Previous repeatedly. */}
          {/* Desktop. Each step owns an equal-width column and the connector is
              drawn behind the row at circle-centre height, so the rails line up
              with the icons instead of floating between the labels. */}
          <ol className="hidden sm:flex items-stretch">
            {steps.map((step, index) => {
              const isDone = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isReachable = step.id <= maxStepReached;

              return (
                <li key={step.id} className="relative flex-1">
                  {index > 0 && (
                    <span
                      aria-hidden
                      className={`absolute left-[-50%] right-1/2 top-6 h-0.5 ${
                        isDone || isCurrent ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => isReachable && goToStep(step.id)}
                    disabled={!isReachable}
                    aria-current={isCurrent ? "step" : undefined}
                    aria-label={`Step ${step.id}: ${step.name}${
                      isDone ? " (completed)" : ""
                    }`}
                    className={`group relative flex w-full flex-col items-center rounded-lg px-2 py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-magenta-500 ${
                      isReachable ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <span
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isDone
                          ? "border-green-500 bg-green-500 text-white"
                          : isCurrent
                            ? "border-magenta-600 bg-magenta-600 text-white ring-4 ring-magenta-100"
                            : "border-gray-300 bg-white text-gray-400"
                      } ${isReachable && !isCurrent ? "group-hover:border-magenta-400" : ""}`}
                    >
                      {isDone ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <step.icon className="h-6 w-6" />
                      )}
                    </span>

                    <span className="mt-3 block text-center">
                      <span
                        className={`block text-sm font-semibold ${
                          currentStep >= step.id
                            ? "text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        {step.name}
                      </span>
                      <span
                        className={`mt-0.5 block text-xs ${
                          currentStep >= step.id
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                      >
                        {step.description}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </motion.div>
      </div>
    </div>
  );
}

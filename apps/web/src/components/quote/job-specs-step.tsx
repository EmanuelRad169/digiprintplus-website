"use client";

import { useEffect, useState } from "react";
import { Lock, Plus, Trash2 } from "lucide-react";
import { getQuoteSettings, QuoteSettings } from "@/lib/sanity/contentFetchers";

export interface QuoteLineItem {
  id: string;
  productType: string;
  productSlug?: string;
  categoryTitle?: string;
  locked?: boolean;
  quantity: string;
  size: string;
  paperType: string;
  finish: string;
  additionalNotes: string;
}

interface JobSpecsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function makeLineItem(
  partial: Partial<QuoteLineItem> = {},
): QuoteLineItem {
  return {
    id:
      partial.id ||
      `li-${Math.random().toString(36).slice(2, 9)}-${String(
        partial.productSlug || "custom",
      ).slice(0, 12)}`,
    productType: partial.productType || "",
    productSlug: partial.productSlug || "",
    categoryTitle: partial.categoryTitle || "",
    locked: partial.locked || false,
    quantity: partial.quantity || "",
    size: partial.size || "",
    paperType: partial.paperType || "",
    finish: partial.finish || "",
    additionalNotes: partial.additionalNotes || "",
  };
}

export function JobSpecsStep({ formData, updateFormData }: JobSpecsStepProps) {
  const [quoteSettings, setQuoteSettings] = useState<QuoteSettings | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    getQuoteSettings()
      .then(setQuoteSettings)
      .catch((error) => console.error("Error fetching quote settings:", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) setIsVisible(true);
  }, [loading]);

  const fallbackSettings: any = {
    jobSpecsStep: {
      title: "Job Specifications",
      description: "Tell us about your project",
      productTypes: [
        "Business Cards",
        "Brochures",
        "Flyers",
        "Posters",
        "Banners",
      ],
      quantities: ["100", "250", "500", "1000", "2500", "5000"],
      paperTypes: [
        "14pt C2S",
        "16pt C2S",
        "100lb Gloss Text",
        "70lb Uncoated Text",
      ],
      finishes: ["Matte", "Gloss", "UV Coating", "Soft Touch"],
      turnaroundTimes: [
        "Standard (3-5 Business Days)",
        "Rush (1-2 Business Days)",
        "Next Day",
      ],
    },
    labels: {
      productType: "Product Type",
      quantity: "Quantity",
      paperType: "Paper Type",
      finish: "Finish",
      turnaround: "Turnaround",
      specialInstructions: "Special Instructions",
    },
  };

  const settings: any = quoteSettings || fallbackSettings;
  const items: QuoteLineItem[] = formData.lineItems?.length
    ? formData.lineItems
    : [makeLineItem()];

  const patchItem = (id: string, patch: Partial<QuoteLineItem>) => {
    updateFormData({
      lineItems: items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    });
  };

  const addItem = () => {
    updateFormData({ lineItems: [...items, makeLineItem()] });
  };

  const removeItem = (id: string) => {
    const next = items.filter((it) => it.id !== id);
    updateFormData({ lineItems: next.length ? next : [makeLineItem()] });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-1/2 rounded bg-gray-200" />
        <div className="h-48 rounded-xl bg-gray-100" />
      </div>
    );
  }

  const select =
    "w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-magenta-500";
  const label = "mb-2 block text-sm font-medium text-gray-700";

  return (
    <div
      className={`space-y-6 transition-all duration-600 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`}
    >
      <div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          {settings.jobSpecsStep.title}
        </h2>
        <p className="text-gray-600">
          {settings.jobSpecsStep.description}
          {items.length > 1 && (
            <span className="ml-1 font-medium text-gray-900">
              {items.length} products in this quote.
            </span>
          )}
        </p>
      </div>

      <div className="space-y-5">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-magenta-100 text-xs font-bold text-magenta-700">
                  {index + 1}
                </span>
                {item.productType || `Product ${index + 1}`}
              </h3>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.productType || `product ${index + 1}`}`}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor={`productType-${item.id}`} className={label}>
                  {settings.labels.productType} *
                </label>
                {item.locked ? (
                  <>
                    <div
                      id={`productType-${item.id}`}
                      tabIndex={-1}
                      className="flex items-center justify-between gap-3 rounded-lg border border-magenta-200 bg-magenta-50 px-4 py-3"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-gray-900">
                          {item.productType}
                        </span>
                        {item.categoryTitle && (
                          <span className="block text-xs text-gray-500">
                            {item.categoryTitle}
                          </span>
                        )}
                      </span>
                      <Lock className="h-4 w-4 flex-shrink-0 text-magenta-500" />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      From the product page
                    </p>
                  </>
                ) : (
                  <select
                    id={`productType-${item.id}`}
                    value={item.productType}
                    onChange={(e) =>
                      patchItem(item.id, { productType: e.target.value })
                    }
                    className={select}
                  >
                    <option value="">Select product type</option>
                    {settings.jobSpecsStep.productTypes.map((t: string) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label htmlFor={`quantity-${item.id}`} className={label}>
                  {settings.labels.quantity} *
                </label>
                <select
                  id={`quantity-${item.id}`}
                  value={item.quantity}
                  onChange={(e) =>
                    patchItem(item.id, { quantity: e.target.value })
                  }
                  className={select}
                >
                  <option value="">Select quantity</option>
                  {settings.jobSpecsStep.quantities.map((q: string) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`size-${item.id}`} className={label}>
                  Size/Dimensions
                </label>
                <input
                  type="text"
                  id={`size-${item.id}`}
                  value={item.size}
                  onChange={(e) => patchItem(item.id, { size: e.target.value })}
                  placeholder="e.g., 3.5 x 2 inches, 8.5 x 11 inches"
                  className={select}
                />
              </div>

              <div>
                <label htmlFor={`paperType-${item.id}`} className={label}>
                  {settings.labels.paperType}
                </label>
                <select
                  id={`paperType-${item.id}`}
                  value={item.paperType}
                  onChange={(e) =>
                    patchItem(item.id, { paperType: e.target.value })
                  }
                  className={select}
                >
                  <option value="">Select paper type</option>
                  {settings.jobSpecsStep.paperTypes.map((t: string) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`finish-${item.id}`} className={label}>
                  {settings.labels.finish}
                </label>
                <select
                  id={`finish-${item.id}`}
                  value={item.finish}
                  onChange={(e) =>
                    patchItem(item.id, { finish: e.target.value })
                  }
                  className={select}
                >
                  <option value="">Select finish</option>
                  {settings.jobSpecsStep.finishes.map((f: string) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`itemNotes-${item.id}`} className={label}>
                  Notes for this product
                </label>
                <input
                  type="text"
                  id={`itemNotes-${item.id}`}
                  value={item.additionalNotes}
                  onChange={(e) =>
                    patchItem(item.id, { additionalNotes: e.target.value })
                  }
                  placeholder="Anything specific to this item"
                  className={select}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-6 py-4 font-semibold text-gray-600 transition-colors hover:border-magenta-400 hover:bg-magenta-50 hover:text-magenta-700"
      >
        <Plus className="h-5 w-5" />
        Add another product
      </button>

      {/* Turnaround and overall notes apply to the whole job, not per item —
          customers think in one deadline for the order. */}
      <div className="grid grid-cols-1 gap-6 rounded-xl border border-gray-200 bg-gray-50 p-5 md:grid-cols-2">
        <div>
          <label htmlFor="turnaround" className={label}>
            {settings.labels.turnaround} *
          </label>
          <select
            id="turnaround"
            name="turnaround"
            value={formData.turnaround}
            onChange={(e) => updateFormData({ turnaround: e.target.value })}
            className={`${select} bg-white`}
          >
            <option value="">Select turnaround</option>
            {settings.jobSpecsStep.turnaroundTimes.map((t: string) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-gray-500">
            Applies to the whole order
          </p>
        </div>

        <div>
          <label htmlFor="additionalNotes" className={label}>
            {settings.labels.specialInstructions}
          </label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            rows={3}
            value={formData.additionalNotes}
            onChange={(e) =>
              updateFormData({ additionalNotes: e.target.value })
            }
            placeholder="Any special requirements, colors, or instructions..."
            className={`${select} bg-white`}
          />
        </div>
      </div>

      <div className="rounded-lg bg-magenta-50 p-4">
        <p className="text-sm text-magenta-800">
          <strong>Note:</strong> Final pricing may vary based on exact
          specifications and file requirements. We&apos;ll provide a detailed
          quote based on your inputs.
        </p>
      </div>
    </div>
  );
}

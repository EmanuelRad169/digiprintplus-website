"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getQuoteSettings, QuoteSettings } from "@/lib/sanity/contentFetchers";

interface JobSpecsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function JobSpecsStep({ formData, updateFormData }: JobSpecsStepProps) {
  const [quoteSettings, setQuoteSettings] = useState<QuoteSettings | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuoteSettings = async () => {
      try {
        const settings = await getQuoteSettings();
        setQuoteSettings(settings);
      } catch (error) {
        console.error("Error fetching quote settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuoteSettings();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div>
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback data if Sanity data is not available
  const fallbackSettings = {
    jobSpecsStep: {
      title: "Job Specifications",
      description: "Tell us about your printing project requirements.",
      productTypes: [
        "Business Cards",
        "Brochures",
        "Banners",
        "Flyers",
        "Posters",
        "Stickers",
        "Letterheads",
        "Other",
      ],
      quantities: [
        "100",
        "250",
        "500",
        "1,000",
        "2,500",
        "5,000",
        "10,000+",
        "Custom",
      ],
      paperTypes: [
        "Standard (80lb Text)",
        "Premium (100lb Text)",
        "Cardstock (14pt)",
        "Heavy Cardstock (16pt)",
        "Ultra Thick (32pt)",
        "Vinyl",
        "Canvas",
        "Other",
      ],
      finishes: [
        "None",
        "Matte Finish",
        "Gloss Finish",
        "UV Coating",
        "Lamination",
        "Embossing",
        "Foil Stamping",
        "Die Cutting",
      ],
      turnaroundTimes: [
        "Standard (3-5 business days)",
        "Rush (1-2 business days)",
        "Same Day (24 hours)",
        "No rush - best price",
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

  const settings = quoteSettings || fallbackSettings;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {settings.jobSpecsStep.title}
        </h2>
        <p className="text-gray-600">{settings.jobSpecsStep.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="productType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {settings.labels.productType} *
          </label>
          <select
            id="productType"
            name="productType"
            value={formData.productType}
            onChange={(e) => updateFormData({ productType: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-500 focus:border-transparent transition-colors duration-200"
            required
          >
            <option value="">Select product type</option>
            {settings.jobSpecsStep.productTypes.map((type: string) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {settings.labels.quantity} *
          </label>
          <select
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={(e) => updateFormData({ quantity: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-500 focus:border-transparent transition-colors duration-200"
            required
          >
            <option value="">Select quantity</option>
            {settings.jobSpecsStep.quantities.map((qty: string) => (
              <option key={qty} value={qty}>
                {qty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="size"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Size/Dimensions
          </label>
          <input
            type="text"
            id="size"
            name="size"
            value={formData.size}
            onChange={(e) => updateFormData({ size: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-500 focus:border-transparent transition-colors duration-200"
            placeholder="e.g., 3.5 x 2 inches, 8.5 x 11 inches"
          />
        </div>

        <div>
          <label
            htmlFor="paperType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {settings.labels.paperType}
          </label>
          <select
            id="paperType"
            name="paperType"
            value={formData.paperType}
            onChange={(e) => updateFormData({ paperType: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-500 focus:border-transparent transition-colors duration-200"
          >
            <option value="">Select paper type</option>
            {settings.jobSpecsStep.paperTypes.map((type: string) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="finish"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {settings.labels.finish}
          </label>
          <select
            id="finish"
            name="finish"
            value={formData.finish}
            onChange={(e) => updateFormData({ finish: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-500 focus:border-transparent transition-colors duration-200"
          >
            <option value="">Select finish</option>
            {settings.jobSpecsStep.finishes.map((finish: string) => (
              <option key={finish} value={finish}>
                {finish}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="turnaround"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {settings.labels.turnaround} *
          </label>
          <select
            id="turnaround"
            name="turnaround"
            value={formData.turnaround}
            onChange={(e) => updateFormData({ turnaround: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-500 focus:border-transparent transition-colors duration-200"
            required
          >
            <option value="">Select turnaround</option>
            {settings.jobSpecsStep.turnaroundTimes.map((time: string) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="additionalNotes"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {settings.labels.specialInstructions}
          </label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={(e) =>
              updateFormData({ additionalNotes: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-500 focus:border-transparent transition-colors duration-200"
            placeholder="Any special requirements, colors, or instructions..."
          />
        </div>
      </div>

      <div className="bg-magenta-50 p-4 rounded-lg">
        <p className="text-sm text-magenta-800">
          <strong>Note:</strong> Final pricing may vary based on exact
          specifications and file requirements. We&apos;ll provide a detailed
          quote based on your inputs.
        </p>
      </div>
    </motion.div>
  );
}

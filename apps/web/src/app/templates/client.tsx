"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  Star,
  Search,
  Download,
  ChevronDown,
  Crown,
  Mail,
  MessageSquare,
  X,
} from "lucide-react";
import {
  getAllTemplateCategories,
  getAllTemplates,
  incrementTemplateDownload,
  type Template,
  type TemplateCategory,
} from "@/lib/sanity/fetchers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const defaultFormats = [
  "All Formats",
  "PDF",
  "AI",
  "PSD",
  "INDD",
  "PPTX",
  "DOCX",
];

interface TemplatesPageClientProps {
  initialTemplates: Template[];
  initialCategories: TemplateCategory[];
}

export default function TemplatesPageClient({
  initialTemplates,
  initialCategories,
}: TemplatesPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("All Formats");
  const [searchTerm, setSearchTerm] = useState("");
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [categories, setCategories] =
    useState<TemplateCategory[]>(initialCategories);
  const [loading, setLoading] = useState(
    initialTemplates.length === 0 && initialCategories.length === 0,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [templatesPerPage] = useState(12);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Log the received data
  useEffect(() => {
    console.log("📦 Client received:", {
      templates: initialTemplates.length,
      categories: initialCategories.length,
    });
  }, [initialTemplates, initialCategories]);

  useEffect(() => {
    const shouldRefetch = templates.length === 0 || categories.length === 0;
    if (!shouldRefetch) return;

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [freshTemplates, freshCategories] = await Promise.all([
          getAllTemplates(),
          getAllTemplateCategories(),
        ]);

        if (cancelled) return;
        if (freshTemplates.length) setTemplates(freshTemplates);
        if (freshCategories.length) setCategories(freshCategories);
      } catch (error) {
        console.error("Error refetching templates/categories:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTemplates = templates.filter((template) => {
    const title = (template.title || "").toLowerCase();
    const description = (template.description || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesCategory =
      activeCategory === "all" ||
      template.category?.slug?.current === activeCategory;
    const matchesFormat =
      selectedFormat === "All Formats" || template.fileType === selectedFormat;
    const matchesSearch =
      title.includes(search) ||
      description.includes(search) ||
      (template.tags &&
        template.tags.some((tag) =>
          (tag || "").toLowerCase().includes(search),
        ));

    return matchesCategory && matchesFormat && matchesSearch;
  });

  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);
  const startIndex = (currentPage - 1) * templatesPerPage;
  const endIndex = startIndex + templatesPerPage;
  const currentTemplates = filteredTemplates.slice(startIndex, endIndex);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleDownload = async (template: Template) => {
    try {
      // Increment download count
      await incrementTemplateDownload(template._id);

      // Update local state
      setTemplates((prev) =>
        prev.map((t) =>
          t._id === template._id
            ? { ...t, downloadCount: t.downloadCount + 1 }
            : t,
        ),
      );

      // Trigger download
      const link = document.createElement("a");
      link.href = template.downloadFile.asset.url;
      link.download =
        template.downloadFile.asset.originalFilename || template.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };

  const renderTemplateCard = (template: Template) => (
    <motion.div
      key={template._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden group border border-gray-100 hover:border-magenta-200 transition-all duration-300"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {template.previewImage?.asset?.url ? (
          <Image
            src={template.previewImage.asset.url}
            alt={template.previewImage.alt || template.title}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center px-4">
              <p className="text-sm font-semibold text-gray-700">
                {template.title}
              </p>
              <p className="mt-1 text-xs text-gray-500">No preview available</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={() => handleDownload(template)}
            className="p-4 bg-white rounded-lg text-gray-800 hover:bg-magenta-600 hover:text-white transition-all shadow-lg transform translate-y-4 group-hover:translate-y-0"
          >
            <Download className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-magenta-600 uppercase tracking-wide">
            {template.category?.title || "Uncategorized"}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">
              {template.rating}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-magenta-600 transition-colors line-clamp-1">
          {template.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {template.description ||
            "Professional template ready for customization"}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              {template.downloadCount}
            </span>
            <span className="font-medium">{template.fileType}</span>
          </div>

          {template.isPremium && template.price && (
            <span className="text-xl font-bold text-magenta-600">
              ${template.price}
            </span>
          )}
        </div>

        <button
          onClick={() => handleDownload(template)}
          className="mt-4 w-full bg-gradient-to-r from-magenta-600 to-pink-500 hover:from-magenta-700 hover:to-pink-600 text-white py-3 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <Download className="w-4 h-4" />
          Download Template
        </button>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-magenta-600 mx-auto"></div>
            <p className="mt-6 text-gray-600 text-lg font-medium">
              Loading templates...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hidden form for Netlify detection */}
      <form
        name="custom-template-request"
        data-netlify="true"
        netlify-honeypot="bot-field"
        hidden
      >
        <input type="text" name="name" />
        <input type="email" name="email" />
        <input type="tel" name="phone" />
        <select name="template-type">
          <option value="business-card">Business Card</option>
        </select>
        <textarea name="description"></textarea>
        <select name="timeline">
          <option value="urgent">ASAP</option>
        </select>
      </form>

      <div className="min-h-screen bg-gray-50">
        {/* Two Column Layout */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - 30% */}
            <aside className="lg:w-[30%]">
              <div className="sticky top-4 space-y-2">
                {/* Search */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Search
                  </h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Format Filter */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    File Format
                  </h3>
                  <div className="relative">
                    <select
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                      className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:border-transparent"
                    >
                      {defaultFormats.map((format) => (
                        <option key={format} value={format}>
                          {format}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleCategoryChange("all")}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeCategory === "all"
                          ? "bg-magenta-600 text-white shadow-md"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      All Templates
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category._id}
                        onClick={() =>
                          handleCategoryChange(category.slug.current)
                        }
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          activeCategory === category.slug.current
                            ? "bg-magenta-600 text-white shadow-md"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {category.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Content - 70% */}
            <main className="lg:w-[70%]">
              <section className="space-y-6">
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="text-6xl mb-6">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      No templates found
                    </h3>
                    <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                      Try adjusting your search criteria or browse all templates
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setActiveCategory("all");
                        setSelectedFormat("All Formats");
                      }}
                      className="bg-gradient-to-r from-magenta-600 to-pink-500 hover:from-magenta-700 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {activeCategory === "all"
                          ? "All Templates"
                          : categories.find(
                              (c) => c.slug.current === activeCategory,
                            )?.title}
                      </h2>
                      <p className="text-gray-600">
                        {filteredTemplates.length} result
                        {filteredTemplates.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    {/* Templates Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {currentTemplates.map(renderTemplateCard)}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex flex-wrap justify-center items-center mt-8 gap-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={currentPage === 1}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          Previous
                        </button>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              currentPage === page
                                ? "bg-gradient-to-r from-magenta-600 to-pink-500 text-white shadow-md"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1),
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </section>
            </main>
          </div>

          {/* CTA Section */}
          <div className="mt-16 -mx-4 bg-gradient-to-r from-magenta-600 via-magenta-500 to-pink-500 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-grid-white/5 bg-[length:20px_20px]"></div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Can&apos;t Find What You&apos;re Looking For?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Request a custom template tailored to your specific needs. Our
                design team will create exactly what you need.
              </p>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center justify-center gap-2 bg-white text-magenta-600 px-8 py-4 rounded-lg font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105">
                    <MessageSquare className="w-5 h-5" />
                    Request Custom Template
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      Request a Custom Template
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Tell us about your custom template needs and we&apos;ll
                      create it for you.
                    </DialogDescription>
                  </DialogHeader>

                  {!formSubmitted ? (
                    <form
                      name="custom-template-request"
                      method="POST"
                      data-netlify="true"
                      netlify-honeypot="bot-field"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        fetch("/", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                          },
                          body: new URLSearchParams(
                            new FormData(form) as any,
                          ).toString(),
                        })
                          .then(() => {
                            setFormSubmitted(true);
                          })
                          .catch((error) => {
                            alert("Error submitting form. Please try again.");
                            console.error(error);
                          });
                      }}
                      className="space-y-5 mt-6"
                    >
                      <input
                        type="hidden"
                        name="form-name"
                        value="custom-template-request"
                      />
                      <p className="hidden">
                        <label>
                          Don&apos;t fill this out: <input name="bot-field" />
                        </label>
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:border-transparent"
                            placeholder="John Doe"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:border-transparent"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:border-transparent"
                          placeholder="(123) 456-7890"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="template-type"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Template Type *
                        </label>
                        <select
                          id="template-type"
                          name="template-type"
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:border-transparent"
                        >
                          <option value="">Select a type...</option>
                          <option value="business-card">Business Card</option>
                          <option value="brochure">Brochure</option>
                          <option value="flyer">Flyer</option>
                          <option value="poster">Poster</option>
                          <option value="banner">Banner</option>
                          <option value="catalog">Catalog</option>
                          <option value="menu">Menu</option>
                          <option value="invitation">Invitation</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Project Description *
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          required
                          rows={4}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:border-transparent resize-none"
                          placeholder="Describe the custom template you need, including size, style preferences, and any specific requirements..."
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="timeline"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Desired Timeline
                        </label>
                        <select
                          id="timeline"
                          name="timeline"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:border-transparent"
                        >
                          <option value="">Select timeline...</option>
                          <option value="urgent">ASAP (Rush)</option>
                          <option value="1-week">Within 1 week</option>
                          <option value="2-weeks">Within 2 weeks</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-magenta-600 to-pink-500 hover:from-magenta-700 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          Submit Request
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Request Submitted!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Thank you! We&apos;ll review your custom template
                        request and get back to you within 24 hours.
                      </p>
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          setFormSubmitted(false);
                        }}
                        className="bg-magenta-600 hover:bg-magenta-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

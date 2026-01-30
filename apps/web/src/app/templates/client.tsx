"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Star,
  Search,
  Download,
  Eye,
  ChevronDown,
  Zap,
  Crown,
  Users,
} from "lucide-react";
import {
  getAllTemplateCategories,
  getAllTemplates,
  incrementTemplateDownload,
  type Template,
  type TemplateCategory,
} from "@/lib/sanity/fetchers";

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
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden group"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {template.previewImage?.asset?.url ? (
          <Image
            src={template.previewImage.asset.url}
            alt={template.previewImage.alt || template.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
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
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-3">
            <Link
              href={`/templates/${template.slug.current}`}
              className="p-2 bg-white/90 rounded-full text-gray-800 hover:bg-white transition-colors"
            >
              <Eye className="w-5 h-5" />
            </Link>
            <button
              onClick={() => handleDownload(template)}
              className="p-2 bg-white/90 rounded-full text-gray-800 hover:bg-white transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
        {template.isPremium && (
          <div className="absolute top-3 right-3">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full text-xs font-semibold flex items-center">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-magenta-600 font-medium">
            {template.category?.title || "Uncategorized"}
          </span>
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {template.rating}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-magenta-600 transition-colors">
          {template.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {template.description || ""}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Download className="w-4 h-4 mr-1" />
              {template.downloadCount}
            </span>
            <span>{template.fileType}</span>
            <span>{template.size}</span>
          </div>

          {template.isPremium && template.price && (
            <span className="text-lg font-bold text-magenta-600">
              ${template.price}
            </span>
          )}
        </div>

        <div className="mt-4 flex space-x-2">
          <Link
            href={`/templates/${template.slug.current}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-center text-sm font-medium transition-colors"
          >
            Preview
          </Link>
          <button
            onClick={() => handleDownload(template)}
            className="flex-1 bg-magenta-600 hover:bg-magenta-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-magenta-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading templates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-magenta-600 via-magenta-700 to-purple-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Professional Design Templates
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl mb-8 text-magenta-100"
            >
              High-quality, customizable templates for all your printing needs
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-6 text-lg"
            >
              <div className="flex items-center">
                <Zap className="w-6 h-6 mr-2 text-yellow-400" />
                Instant Download
              </div>
              <div className="flex items-center">
                <Users className="w-6 h-6 mr-2 text-yellow-400" />
                Professional Quality
              </div>
              <div className="flex items-center">
                <Star className="w-6 h-6 mr-2 text-yellow-400" />
                Easy to Customize
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:border-transparent"
              />
            </div>

            {/* Format Filter */}
            <div className="relative">
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:border-transparent"
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
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === "all"
                  ? "bg-magenta-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Templates
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryChange(category.slug.current)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.slug.current
                    ? "bg-magenta-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeCategory === "all"
                ? "All Templates"
                : categories.find((c) => c.slug.current === activeCategory)
                    ?.title}
            </h2>
            <p className="text-gray-600">
              {filteredTemplates.length} template
              {filteredTemplates.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                No templates found
              </h3>
              <p className="text-gray-600 mb-8">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("all");
                  setSelectedFormat("All Formats");
                }}
                className="bg-magenta-600 hover:bg-magenta-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {currentTemplates.map(renderTemplateCard)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          currentPage === page
                            ? "bg-magenta-600 text-white"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

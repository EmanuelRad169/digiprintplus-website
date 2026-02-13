import { draftMode } from "next/headers";
import dynamic from "next/dynamic";
import {
  getAllTemplateCategories,
  getAllTemplates,
} from "@/lib/sanity/fetchers";

// Dynamic import for large client component (699 lines)
const TemplatesPageClient = dynamic(() => import("./client"), {
  ssr: true, // Keep SSR for SEO
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  ),
});

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;

export default async function TemplatesPage() {
  const { isEnabled } = await draftMode();

  const [templates, categories] = await Promise.all([
    getAllTemplates(),
    getAllTemplateCategories(),
  ]);

  return (
    <TemplatesPageClient
      initialTemplates={templates}
      initialCategories={categories}
    />
  );
}

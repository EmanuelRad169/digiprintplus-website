import TemplatesPageClient from "./client";
import {
  getAllTemplateCategories,
  getAllTemplates,
} from "@/lib/sanity/fetchers";

export const revalidate = 300;

export default async function TemplatesPage() {
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

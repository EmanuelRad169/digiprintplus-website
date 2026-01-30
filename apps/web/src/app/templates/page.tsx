import { draftMode } from "next/headers";
import TemplatesPageClient from "./client";
import {
  getAllTemplateCategories,
  getAllTemplates,
} from "@/lib/sanity/fetchers";

// Static export mode - data fetched at build time
export const dynamic = "force-static";
export const revalidate = false;

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

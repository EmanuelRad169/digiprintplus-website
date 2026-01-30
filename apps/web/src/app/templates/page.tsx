import { draftMode } from "next/headers";
import TemplatesPageClient from "./client";
import {
  getAllTemplateCategories,
  getAllTemplates,
} from "@/lib/sanity/fetchers";

export const revalidate = 300;

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

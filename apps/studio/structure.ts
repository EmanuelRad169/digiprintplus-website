import type {
  DefaultDocumentNodeResolver,
  StructureResolver,
} from "sanity/desk";
import {
  DocumentTextIcon,
  DocumentsIcon,
  DocumentIcon,
  PackageIcon,
  CogIcon,
  ImagesIcon,
  ImageIcon,
  UsersIcon,
  UserIcon,
  TagIcon,
  TagsIcon,
  BlockContentIcon,
  HelpCircleIcon,
  PresentationIcon,
  CaseIcon,

  ClipboardIcon,
  EnvelopeIcon,
  RocketIcon,
  BellIcon,
  SearchIcon,
  CogIcon as GearIcon,
  CheckmarkCircleIcon,
  CloseCircleIcon,
} from "@sanity/icons";
import { singletonListItem } from "./singletons";

export const getDefaultDocumentNode: DefaultDocumentNodeResolver = (S) => {
  return S.document();
};

// A quote-pipeline list filtered to one status, newest first.
const quoteStatusItem = (
  S: any,
  title: string,
  status: string,
  icon: any,
) =>
  S.listItem()
    .id(`quotes-${status}`)
    .title(title)
    .icon(icon)
    .child(
      S.documentList()
        .title(`${title} Quote Requests`)
        .filter('_type == "quoteRequest" && status == $status')
        .params({ status })
        .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
    );

const structure: StructureResolver = (S) => {
  // Groups are ordered by daily use: the incoming-work inbox first, then the
  // catalog, then marketing content, then supporting assets, and finally the
  // system/settings that are rarely touched (behind a divider).
  return S.list()
    .title("Content")
    .items([
      // ── Quote Requests & Users (the business inbox) ───────
      S.listItem()
        .title("Quote Requests")
        .icon(ClipboardIcon)
        .child(
          S.list()
            .title("Quote Requests & Users")
            .items([
              // Status pipeline — work the queue like a kanban.
              quoteStatusItem(S, "New", "new", BellIcon),
              quoteStatusItem(S, "In Review", "in-review", SearchIcon),
              quoteStatusItem(S, "Quote Sent", "quote-sent", EnvelopeIcon),
              quoteStatusItem(S, "In Production", "in-production", GearIcon),
              quoteStatusItem(
                S,
                "Completed",
                "completed",
                CheckmarkCircleIcon,
              ),
              quoteStatusItem(S, "Cancelled", "cancelled", CloseCircleIcon),
              S.divider(),
              S.documentTypeListItem("quoteRequest")
                .title("All Quote Requests")
                .icon(ClipboardIcon),
              S.documentTypeListItem("user").title("Users").icon(UsersIcon),
            ]),
        ),

      // ── Products (the catalog) ────────────────────────────
      S.listItem()
        .title("Products")
        .icon(PackageIcon)
        .child(
          S.list()
            .title("Products")
            .items([
              S.documentTypeListItem("product")
                .title("Products")
                .icon(PackageIcon),
              S.documentTypeListItem("productCategory")
                .title("Product Categories")
                .icon(TagsIcon),
              S.documentTypeListItem("template")
                .title("Templates")
                .icon(DocumentsIcon),
              S.documentTypeListItem("templateCategory")
                .title("Template Categories")
                .icon(TagIcon),
            ]),
        ),

      // ── Pages ─────────────────────────────────────────────
      // Ordered to mirror the site's own navigation, so "edit the About page"
      // means clicking the entry called About Page. Reusable blocks that make
      // up those pages (hero slides, CTA bands, about sections) sit below a
      // divider in the same group rather than in a separate "Site Content"
      // list, because an editor looking for them is already looking here.
      S.listItem()
        .title("Pages")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Pages")
            .items([
              S.listItem()
                .title("Home Page")
                .icon(PresentationIcon)
                .child(
                  S.list()
                    .title("Home Page")
                    .items([
                      singletonListItem(S, "homepageSettings"),
                      S.documentTypeListItem("heroSlide")
                        .title("Hero Slides")
                        .icon(PresentationIcon),
                    ]),
                ),
              singletonListItem(S, "aboutPage"),
              singletonListItem(S, "contactPage"),
              singletonListItem(S, "finishingPage"),
              S.documentTypeListItem("service")
                .title("Services")
                .icon(CaseIcon),
              S.documentTypeListItem("page")
                .title("Other Pages")
                .icon(DocumentIcon),

              S.divider(),

              // Blocks reused across several pages.
              S.documentTypeListItem("ctaSection")
                .title("Call-to-Action Bands")
                .icon(RocketIcon),
              S.documentTypeListItem("aboutSection")
                .title("About Sections")
                .icon(BlockContentIcon),
              S.documentTypeListItem("faqItem")
                .title("FAQ Items")
                .icon(HelpCircleIcon),
              S.documentTypeListItem("contactInfo")
                .title("Contact Info Blocks")
                .icon(EnvelopeIcon),
            ]),
        ),

      // ── Blog ──────────────────────────────────────────────
      S.listItem()
        .title("Blog")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Blog")
            .items([
              S.documentTypeListItem("post")
                .title("Posts")
                .icon(DocumentTextIcon),
              S.documentTypeListItem("author")
                .title("Authors")
                .icon(UserIcon),
              S.documentTypeListItem("category")
                .title("Categories")
                .icon(TagIcon),
            ]),
        ),

      S.divider(),

      // ── Media ─────────────────────────────────────────────
      S.listItem()
        .title("Media")
        .icon(ImagesIcon)
        .child(
          S.list()
            .title("Media")
            .items([
              S.listItem()
                .title("Template Files")
                .icon(DocumentsIcon)
                .child(
                  S.documentTypeList("media")
                    .title("Template Files")
                    .filter('_type == "media" && category == $category')
                    .params({ category: "template-files" }),
                ),
              S.documentTypeListItem("media")
                .title("All Media")
                .icon(ImageIcon),
            ]),
        ),

      S.divider(),

      // ── Site Settings (rarely touched) ────────────────────
      S.listItem()
        .title("Site Settings")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Site Settings")
            .items([
              singletonListItem(S, "siteSettings"),
              singletonListItem(S, "navigationMenu"),
              singletonListItem(S, "footer"),
              singletonListItem(S, "quoteSettings"),
              singletonListItem(S, "integrationSettings"),
              // Homepage Settings now lives under Pages → Home Page, where an
              // editor would look for it. pageSettings is not listed at all:
              // nothing in the site reads it, and the section headings it was
              // meant to control now live on the pages' own documents.
            ]),
        ),
    ]);
};

export default structure;

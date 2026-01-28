import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "quoteRequest",
  title: "Quote Request",
  type: "document",
  groups: [
    {
      name: "overview",
      title: "Overview",
      default: true,
    },
    {
      name: "customer",
      title: "Customer Info",
    },
    {
      name: "project",
      title: "Project Details",
    },
    {
      name: "quote",
      title: "Quote & Pricing",
    },
    {
      name: "files",
      title: "Files & Documents",
    },
    {
      name: "workflow",
      title: "Workflow & Notes",
    },
  ],
  fields: [
    // Overview Tab
    defineField({
      name: "requestId",
      title: "Request ID",
      type: "string",
      group: "overview",
      readOnly: true,
      initialValue: () => `QR-${Date.now().toString().slice(-6)}`,
      description: "Auto-generated unique identifier for this quote request",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "overview",
      options: {
        list: [
          { title: "🆕 New", value: "new" },
          { title: "👀 In Review", value: "in-review" },
          { title: "📄 Quote Sent", value: "quote-sent" },
          { title: "✅ Approved", value: "approved" },
          { title: "🏭 In Production", value: "in-production" },
          { title: "🎉 Completed", value: "completed" },
          { title: "❌ Cancelled", value: "cancelled" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "new",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Priority Level",
      type: "string",
      group: "overview",
      options: {
        list: [
          { title: "🟢 Low", value: "low" },
          { title: "🟡 Normal", value: "normal" },
          { title: "🟠 High", value: "high" },
          { title: "🔴 Urgent", value: "urgent" },
        ],
        layout: "dropdown",
      },
      initialValue: "normal",
    }),
    defineField({
      name: "assignedTo",
      title: "Assigned Team Member",
      type: "reference",
      group: "overview",
      to: [{ type: "user" }],
      description: "Team member responsible for this quote",
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted Date",
      type: "datetime",
      group: "overview",
      initialValue: () => new Date().toISOString(),
      description: "When this quote request was submitted",
    }),

    // Customer Info Tab
    defineField({
      name: "contact",
      title: "Customer Contact Information",
      type: "object",
      group: "customer",
      options: {
        collapsible: false,
      },
      fields: [
        defineField({
          name: "firstName",
          title: "First Name",
          type: "string",
          validation: (Rule) => Rule.required(),
          placeholder: "Enter customer's first name",
        }),
        defineField({
          name: "lastName",
          title: "Last Name",
          type: "string",
          validation: (Rule) => Rule.required(),
          placeholder: "Enter customer's last name",
        }),
        defineField({
          name: "email",
          title: "Email Address",
          type: "string",
          validation: (Rule) => Rule.required().email(),
          placeholder: "customer@example.com",
        }),
        defineField({
          name: "phone",
          title: "Phone Number",
          type: "string",
          validation: (Rule) => Rule.required(),
          placeholder: "Your phone number",
        }),
        defineField({
          name: "company",
          title: "Company Name",
          type: "string",
          placeholder: "Customer's company (optional)",
        }),
        defineField({
          name: "website",
          title: "Company Website",
          type: "url",
          placeholder: "https://company.com",
        }),
        defineField({
          name: "address",
          title: "Billing/Delivery Address",
          type: "object",
          options: {
            collapsible: true,
            collapsed: true,
          },
          fields: [
            defineField({
              name: "street",
              title: "Street Address",
              type: "string",
            }),
            defineField({
              name: "city",
              title: "City",
              type: "string",
            }),
            defineField({
              name: "state",
              title: "State/Province",
              type: "string",
            }),
            defineField({
              name: "zipCode",
              title: "ZIP/Postal Code",
              type: "string",
            }),
            defineField({
              name: "country",
              title: "Country",
              type: "string",
              initialValue: "United States",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "customerType",
      title: "Customer Type",
      type: "string",
      group: "customer",
      options: {
        list: [
          { title: "🆕 New Customer", value: "new" },
          { title: "🔄 Returning Customer", value: "returning" },
          { title: "💼 Business Account", value: "business" },
          { title: "🏢 Enterprise Client", value: "enterprise" },
        ],
      },
      initialValue: "new",
    }),

    // Project Details Tab
    defineField({
      name: "projectInfo",
      title: "Project Overview",
      type: "object",
      group: "project",
      fields: [
        defineField({
          name: "projectName",
          title: "Project Name",
          type: "string",
          placeholder: "Brief name for this project",
        }),
        defineField({
          name: "description",
          title: "Project Description",
          type: "text",
          rows: 3,
          placeholder: "Detailed description of what the customer needs...",
        }),
        defineField({
          name: "industry",
          title: "Industry/Sector",
          type: "string",
          options: {
            list: [
              "Healthcare",
              "Education",
              "Technology",
              "Retail",
              "Real Estate",
              "Non-Profit",
              "Government",
              "Manufacturing",
              "Other",
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "jobSpecs",
      title: "Printing Specifications",
      type: "object",
      group: "project",
      options: {
        collapsible: false,
      },
      fields: [
        defineField({
          name: "productType",
          title: "Product Type",
          type: "string",
          validation: (Rule) => Rule.required(),
          options: {
            list: [
              "Business Cards",
              "Flyers/Leaflets",
              "Brochures",
              "Posters",
              "Banners",
              "Postcards",
              "Letterheads",
              "Envelopes",
              "Labels/Stickers",
              "Booklets",
              "Catalogs",
              "Invitations",
              "Custom",
            ],
          },
          placeholder: "Select or type product type",
        }),
        defineField({
          name: "quantity",
          title: "Quantity Needed",
          type: "string",
          validation: (Rule) => Rule.required(),
          placeholder: 'e.g., 1000, 500-1000, or "Large volume"',
        }),
        defineField({
          name: "size",
          title: "Size/Dimensions",
          type: "string",
          placeholder: 'e.g., 8.5" x 11", A4, Custom size',
        }),
        defineField({
          name: "paperType",
          title: "Paper/Material Type",
          type: "string",
          options: {
            list: [
              "Standard Paper (80gsm)",
              "Heavy Paper (120gsm)",
              "Cardstock (250gsm)",
              "Glossy Paper",
              "Matte Paper",
              "Vinyl",
              "Canvas",
              "Fabric",
              "Other/Custom",
            ],
          },
        }),
        defineField({
          name: "printing",
          title: "Printing Options",
          type: "object",
          options: {
            collapsible: true,
            collapsed: false,
          },
          fields: [
            defineField({
              name: "colorType",
              title: "Color Type",
              type: "string",
              options: {
                list: [
                  { title: "Full Color (CMYK)", value: "full-color" },
                  { title: "Black & White", value: "bw" },
                  { title: "Spot Colors", value: "spot" },
                ],
                layout: "radio",
              },
            }),
            defineField({
              name: "sides",
              title: "Print Sides",
              type: "string",
              options: {
                list: [
                  { title: "Single Side", value: "single" },
                  { title: "Double Side", value: "double" },
                ],
                layout: "radio",
              },
            }),
          ],
        }),
        defineField({
          name: "finish",
          title: "Finishing Options",
          type: "array",
          of: [{ type: "string" }],
          options: {
            list: [
              "Glossy Lamination",
              "Matte Lamination",
              "UV Coating",
              "Embossing",
              "Foil Stamping",
              "Die Cutting",
              "Folding",
              "Binding",
              "Perforation",
            ],
          },
        }),
        defineField({
          name: "turnaround",
          title: "Required Turnaround Time",
          type: "string",
          validation: (Rule) => Rule.required(),
          options: {
            list: [
              { title: "⚡ Rush (1-2 days)", value: "rush" },
              { title: "🚀 Standard (3-5 days)", value: "standard" },
              { title: "📅 Extended (1-2 weeks)", value: "extended" },
              { title: "🗓️ Flexible", value: "flexible" },
            ],
          },
        }),
        defineField({
          name: "deliveryMethod",
          title: "Preferred Delivery",
          type: "string",
          options: {
            list: [
              "Pickup",
              "Local Delivery",
              "Standard Shipping",
              "Express Shipping",
              "Digital Delivery",
            ],
          },
        }),
        defineField({
          name: "additionalNotes",
          title: "Additional Specifications",
          type: "text",
          rows: 3,
          placeholder:
            "Any special requirements, questions, or additional details...",
        }),
      ],
    }),

    // Quote & Pricing Tab
    defineField({
      name: "estimate",
      title: "Quote Information",
      type: "object",
      group: "quote",
      options: {
        collapsible: false,
      },
      fields: [
        defineField({
          name: "amount",
          title: "Quote Amount",
          type: "number",
          validation: (Rule) => Rule.min(0),
          placeholder: "0.00",
        }),
        defineField({
          name: "currency",
          title: "Currency",
          type: "string",
          options: {
            list: [
              { title: "USD ($)", value: "USD" },
              { title: "EUR (€)", value: "EUR" },
              { title: "GBP (£)", value: "GBP" },
              { title: "CAD (C$)", value: "CAD" },
            ],
          },
          initialValue: "USD",
        }),
        defineField({
          name: "breakdown",
          title: "Cost Breakdown",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "item",
                  title: "Item",
                  type: "string",
                  placeholder: "e.g., Printing, Design, Shipping",
                }),
                defineField({
                  name: "cost",
                  title: "Cost",
                  type: "number",
                }),
                defineField({
                  name: "description",
                  title: "Description",
                  type: "string",
                  placeholder: "Brief description of this cost",
                }),
              ],
              preview: {
                select: {
                  title: "item",
                  subtitle: "cost",
                },
                prepare(selection: any) {
                  return {
                    title: selection.title,
                    subtitle: `$${selection.subtitle || 0}`,
                  };
                },
              },
            }),
          ],
        }),
        defineField({
          name: "validUntil",
          title: "Quote Valid Until",
          type: "date",
          description: "Date until which this quote is valid",
        }),
        defineField({
          name: "terms",
          title: "Terms & Conditions",
          type: "text",
          rows: 3,
          placeholder: "Payment terms, delivery conditions, etc.",
        }),
        defineField({
          name: "notes",
          title: "Quote Notes",
          type: "text",
          rows: 2,
          description: "Additional notes about the quote or pricing",
        }),
      ],
    }),

    // Files & Documents Tab
    defineField({
      name: "files",
      title: "Customer Files",
      type: "array",
      group: "files",
      of: [
        defineArrayMember({
          type: "file",
          options: {
            accept: ".pdf,.ai,.eps,.jpg,.jpeg,.png,.psd,.indd,.doc,.docx",
          },
          fields: [
            defineField({
              name: "description",
              title: "File Description",
              type: "string",
              placeholder: "What is this file for?",
            }),
            defineField({
              name: "fileType",
              title: "File Type",
              type: "string",
              options: {
                list: [
                  "Artwork/Design",
                  "Logo",
                  "Reference Material",
                  "Content/Text",
                  "Other",
                ],
              },
            }),
          ],
        }),
      ],
      description: "Files uploaded by the customer (artwork, references, etc.)",
    }),
    defineField({
      name: "quotePDF",
      title: "Generated Quote PDF",
      type: "file",
      group: "files",
      description: "Final quote document to send to customer",
      options: {
        accept: ".pdf",
      },
    }),
    defineField({
      name: "proofs",
      title: "Design Proofs",
      type: "array",
      group: "files",
      of: [
        defineArrayMember({
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "version",
              title: "Version",
              type: "string",
              placeholder: "v1, v2, final, etc.",
            }),
            defineField({
              name: "notes",
              title: "Proof Notes",
              type: "string",
              placeholder: "Changes or comments about this proof",
            }),
            defineField({
              name: "approved",
              title: "Customer Approved",
              type: "boolean",
              initialValue: false,
            }),
          ],
        }),
      ],
      description: "Design proofs for customer approval",
    }),

    // Workflow & Notes Tab
    defineField({
      name: "customerMessage",
      title: "Customer Message",
      type: "text",
      group: "workflow",
      rows: 3,
      description: "Original message from the customer",
      readOnly: true,
    }),
    defineField({
      name: "notes",
      title: "Internal Notes & Updates",
      type: "array",
      group: "workflow",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "note",
              title: "Note",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "author",
              title: "Author",
              type: "reference",
              to: [{ type: "user" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "type",
              title: "Note Type",
              type: "string",
              options: {
                list: [
                  { title: "💬 General Note", value: "general" },
                  { title: "📞 Customer Contact", value: "contact" },
                  { title: "🔄 Status Update", value: "status" },
                  { title: "⚠️ Issue/Problem", value: "issue" },
                  { title: "✅ Resolution", value: "resolution" },
                ],
              },
              initialValue: "general",
            }),
            defineField({
              name: "createdAt",
              title: "Created At",
              type: "datetime",
              initialValue: () => new Date().toISOString(),
              readOnly: true,
            }),
          ],
          preview: {
            select: {
              note: "note",
              author: "author.name",
              type: "type",
              createdAt: "createdAt",
            },
            prepare(selection: any) {
              const { note, author, type, createdAt } = selection;
              const date = new Date(createdAt).toLocaleDateString();
              return {
                title:
                  note?.substring(0, 50) + (note?.length > 50 ? "..." : ""),
                subtitle: `${author} • ${type} • ${date}`,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "followUpDate",
      title: "Follow-up Date",
      type: "datetime",
      group: "workflow",
      description: "When to follow up with the customer",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "workflow",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      description: "Tags for organizing and filtering quotes",
    }),
  ],

  // Enhanced Preview
  preview: {
    select: {
      requestId: "requestId",
      firstName: "contact.firstName",
      lastName: "contact.lastName",
      company: "contact.company",
      productType: "jobSpecs.productType",
      status: "status",
      priority: "priority",
      amount: "estimate.amount",
      currency: "estimate.currency",
    },
    prepare(selection: any) {
      const {
        requestId,
        firstName,
        lastName,
        company,
        productType,
        status,
        priority,
        amount,
        currency,
      } = selection;

      // Create customer display name
      const customerName = `${firstName || ""} ${lastName || ""}`.trim();
      const displayName = company
        ? `${customerName} (${company})`
        : customerName;

      // Create status with emoji
      const statusEmojis: { [key: string]: string } = {
        new: "🆕",
        "in-review": "👀",
        "quote-sent": "📄",
        approved: "✅",
        "in-production": "🏭",
        completed: "🎉",
        cancelled: "❌",
      };

      const priorityEmojis: { [key: string]: string } = {
        low: "🟢",
        normal: "🟡",
        high: "🟠",
        urgent: "🔴",
      };

      // Build subtitle with key info
      const parts = [];
      if (productType) parts.push(productType);
      if (amount) parts.push(`${currency || "$"}${amount}`);
      parts.push(`${statusEmojis[status] || ""} ${status}`);
      if (priority !== "normal")
        parts.push(`${priorityEmojis[priority] || ""} ${priority}`);

      return {
        title: `${requestId} • ${displayName}`,
        subtitle: parts.join(" • "),
      };
    },
  },

  // List view orderings
  orderings: [
    {
      title: "Newest First",
      name: "newestFirst",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
    {
      title: "Status",
      name: "status",
      by: [
        { field: "status", direction: "asc" },
        { field: "priority", direction: "desc" },
        { field: "submittedAt", direction: "desc" },
      ],
    },
    {
      title: "Priority",
      name: "priority",
      by: [
        { field: "priority", direction: "desc" },
        { field: "submittedAt", direction: "desc" },
      ],
    },
    {
      title: "Quote Value",
      name: "value",
      by: [
        { field: "estimate.amount", direction: "desc" },
        { field: "submittedAt", direction: "desc" },
      ],
    },
  ],
});

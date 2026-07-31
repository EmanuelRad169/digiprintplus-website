import React, { useEffect, useState } from "react";
import { useClient } from "sanity";
import { IntentLink } from "sanity/router";

/**
 * DigiPrintPlus workflow dashboard.
 *
 * Monochrome, full-width, non-technical. Leads with what needs attention,
 * visualizes the quote pipeline and the catalog as simple horizontal bars,
 * and lists the most recent quote requests. No brand color by design.
 */

const INK = "#111827";
const SUB = "#6b7280";
const FAINT = "#9ca3af";
const BORDER = "#e5e7eb";
const TRACK = "#f3f4f6";
const BAR = "#374151";

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  "in-review": "In review",
  "quote-sent": "Quote sent",
  approved: "Approved",
  "in-production": "In production",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STAGES = [
  { status: "new", label: "New" },
  { status: "in-review", label: "In review" },
  { status: "quote-sent", label: "Quote sent" },
  { status: "in-production", label: "In production" },
  { status: "completed", label: "Completed" },
];

type QuoteRow = {
  _id: string;
  _type: string;
  requestId?: string;
  status?: string;
  who?: string;
  product?: string;
};

type CategoryRow = { name?: string; count: number };

type DashboardData = {
  newQuotes: number;
  openQuotes: number;
  products: number;
  templates: number;
  drafts: number;
  pipeline: { status: string; count: number }[];
  recentQuotes: QuoteRow[];
  categories: CategoryRow[];
};

const QUERY = `{
  "newQuotes": count(*[_type=="quoteRequest" && status=="new" && !(_id in path("drafts.**"))]),
  "openQuotes": count(*[_type=="quoteRequest" && status in ["new","in-review","quote-sent","in-production"] && !(_id in path("drafts.**"))]),
  "products": count(*[_type=="product" && !(_id in path("drafts.**"))]),
  "templates": count(*[_type=="template" && !(_id in path("drafts.**"))]),
  "drafts": count(*[_id in path("drafts.**")]),
  "pipeline": [
    {"status":"new","count": count(*[_type=="quoteRequest" && status=="new" && !(_id in path("drafts.**"))])},
    {"status":"in-review","count": count(*[_type=="quoteRequest" && status=="in-review" && !(_id in path("drafts.**"))])},
    {"status":"quote-sent","count": count(*[_type=="quoteRequest" && status=="quote-sent" && !(_id in path("drafts.**"))])},
    {"status":"in-production","count": count(*[_type=="quoteRequest" && status=="in-production" && !(_id in path("drafts.**"))])},
    {"status":"completed","count": count(*[_type=="quoteRequest" && status=="completed" && !(_id in path("drafts.**"))])}
  ],
  "recentQuotes": *[_type=="quoteRequest" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0...7]{
    _id, _type, requestId, status,
    "who": coalesce(contact.company, contact.firstName + " " + contact.lastName, "—"),
    "product": jobSpecs[0].productType, "itemCount": count(jobSpecs)
  },
  "categories": *[_type=="productCategory" && !(_id in path("drafts.**"))]{
    "name": coalesce(title, name, "Untitled"),
    "count": count(*[_type=="product" && !(_id in path("drafts.**")) && references(^._id)])
  } | order(count desc)[0...8]
}`;

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div
      style={{
        flex: "1 1 150px",
        minWidth: 150,
        padding: "16px 4px",
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 700, color: INK, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12.5, color: SUB, marginTop: 6 }}>{label}</div>
    </div>
  );
}

function BarRow({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "7px 0" }}>
      <div
        style={{
          width: 140,
          flexShrink: 0,
          fontSize: 13,
          color: value === 0 ? FAINT : INK,
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          height: 20,
          background: TRACK,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: value === 0 ? "transparent" : BAR,
            borderRadius: 4,
            minWidth: value > 0 ? 3 : 0,
          }}
        />
      </div>
      <div
        style={{
          width: 40,
          flexShrink: 0,
          textAlign: "right",
          fontSize: 13,
          fontWeight: 600,
          color: value === 0 ? FAINT : INK,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Card({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        flex: "1 1 420px",
        minWidth: 320,
        background: "#fff",
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "13px 18px",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 13.5, color: INK }}>
          {title}
        </span>
        {action}
      </div>
      <div style={{ padding: "6px 18px 12px" }}>{children}</div>
    </div>
  );
}

export function DashboardTool() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    client
      .fetch<DashboardData>(QUERY)
      .then((d) => active && setData(d))
      .catch((e) => active && setError(e?.message || "Failed to load"));
    return () => {
      active = false;
    };
  }, [client]);

  const pipelineMax = data
    ? Math.max(1, ...data.pipeline.map((p) => p.count))
    : 1;
  const categoryMax = data
    ? Math.max(1, ...data.categories.map((c) => c.count))
    : 1;

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "26px 32px 64px",
        background: "#fff",
        minHeight: "100%",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div style={{ marginBottom: 4 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: INK }}>
          Dashboard
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: SUB }}>
          Your incoming quotes and catalog at a glance.
        </p>
      </div>

      {error ? (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
            color: SUB,
            fontSize: 13,
          }}
        >
          Couldn’t load dashboard data: {error}
        </div>
      ) : !data ? (
        <div style={{ marginTop: 20, color: SUB, fontSize: 13 }}>Loading…</div>
      ) : (
        <>
          {/* Attention banner */}
          {data.newQuotes > 0 && (
            <div
              style={{
                marginTop: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "14px 18px",
                border: `1px solid ${INK}`,
                borderRadius: 10,
              }}
            >
              <span style={{ fontSize: 14, color: INK }}>
                <strong>{data.newQuotes}</strong> new quote{" "}
                {data.newQuotes === 1 ? "request is" : "requests are"} waiting
                for a response.
              </span>
              <IntentLink
                intent="edit"
                params={{ id: data.recentQuotes[0]?._id, type: "quoteRequest" }}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: INK,
                  textDecoration: "none",
                  border: `1px solid ${INK}`,
                  borderRadius: 6,
                  padding: "6px 12px",
                  whiteSpace: "nowrap",
                }}
              >
                Review →
              </IntentLink>
            </div>
          )}

          {/* Stat strip */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 22,
              padding: "4px 0",
              borderTop: `1px solid ${BORDER}`,
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            <Stat value={data.openQuotes} label="Open quotes" />
            <Stat value={data.products} label="Products" />
            <Stat value={data.templates} label="Templates" />
            <Stat value={data.newQuotes} label="New requests" />
            <Stat value={data.drafts} label="Unpublished drafts" />
          </div>

          {/* Quote pipeline — the workflow, visualized */}
          <div style={{ marginTop: 28 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: INK,
                marginBottom: 10,
              }}
            >
              Quote pipeline
            </div>
            <div
              style={{
                border: `1px solid ${BORDER}`,
                borderRadius: 10,
                padding: "12px 18px",
              }}
            >
              {STAGES.map((s) => (
                <BarRow
                  key={s.status}
                  label={s.label}
                  value={
                    data.pipeline.find((p) => p.status === s.status)?.count ?? 0
                  }
                  max={pipelineMax}
                />
              ))}
            </div>
          </div>

          {/* Two columns: recent quotes + catalog by category */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
              marginTop: 28,
            }}
          >
            <Card title="Recent quote requests">
              {data.recentQuotes.length === 0 ? (
                <div style={{ padding: "12px 0", color: SUB, fontSize: 13 }}>
                  No quote requests yet.
                </div>
              ) : (
                data.recentQuotes.map((q, i) => (
                  <IntentLink
                    key={q._id}
                    intent="edit"
                    params={{ id: q._id, type: q._type }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "11px 0",
                      borderTop:
                        i === 0 ? "none" : `1px solid ${BORDER}`,
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: INK,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {q.who || q.requestId || "Quote request"}
                      </div>
                      <div style={{ fontSize: 11.5, color: SUB }}>
                        {[q.requestId, q.product].filter(Boolean).join(" · ") ||
                          "—"}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11.5,
                        color: SUB,
                        border: `1px solid ${BORDER}`,
                        borderRadius: 999,
                        padding: "2px 9px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {q.status ? STATUS_LABEL[q.status] || q.status : "—"}
                    </span>
                  </IntentLink>
                ))
              )}
            </Card>

            <Card title="Products by category">
              {data.categories.length === 0 ? (
                <div style={{ padding: "12px 0", color: SUB, fontSize: 13 }}>
                  No categories yet.
                </div>
              ) : (
                <div style={{ paddingTop: 6 }}>
                  {data.categories.map((c, i) => (
                    <BarRow
                      key={i}
                      label={c.name || "Untitled"}
                      value={c.count}
                      max={categoryMax}
                    />
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardTool;

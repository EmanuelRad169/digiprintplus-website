"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Sanity's visual editing overlay, loaded only for editors.
 *
 * This used to `import { VisualEditing } from "@sanity/visual-editing/react"`
 * at module scope. The component lives in the root layout, so that static
 * import put the whole overlay — @sanity/visual-editing, @sanity/ui, the
 * client mutation API and lodash — into the shared layout chunk: 361 KB that
 * every visitor downloaded and spent ~2.8s evaluating on the main thread,
 * to render nothing at all unless a draft-mode cookie was present.
 *
 * next/dynamic defers the import to render time, and this only renders in
 * draft mode, so ordinary visitors never fetch it.
 */
const SanityVisualEditing = dynamic(
  () => import("@sanity/visual-editing/react").then((m) => m.VisualEditing),
  { ssr: false },
);

export function VisualEditing() {
  const [isDraftMode, setIsDraftMode] = useState(false);

  useEffect(() => {
    // The API route sets this cookie when draft mode is enabled.
    setIsDraftMode(document.cookie.includes("__prerender_bypass"));
  }, []);

  if (!isDraftMode) return null;
  return <SanityVisualEditing portal={true} />;
}

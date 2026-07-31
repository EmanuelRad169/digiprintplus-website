import React from "react";

/**
 * Plain monochrome wordmark for the Studio navbar — no colored box, no
 * gradient. Text inherits the navbar color.
 */
export function StudioLogo() {
  return (
    <span
      style={{
        fontSize: 15,
        fontWeight: 700,
        color: "inherit",
        letterSpacing: "-0.01em",
      }}
    >
      DigiPrintPlus{" "}
      <span style={{ fontWeight: 400, color: "#9ca3af" }}>Admin</span>
    </span>
  );
}

export default StudioLogo;

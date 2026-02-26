/**
 * Performance utilities for optimizing client-side performance
 */

export const shouldReduceMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const isSlowConnection = () => {
  if (typeof navigator === "undefined" || !("connection" in navigator))
    return false;
  const connection = (navigator as any).connection;
  return (
    connection &&
    (connection.effectiveType === "slow-2g" ||
      connection.effectiveType === "2g")
  );
};

export const prefersReducedData = () => {
  if (typeof navigator === "undefined" || !("connection" in navigator))
    return false;
  const connection = (navigator as any).connection;
  return connection && connection.saveData === true;
};

export const getOptimizationLevel = (): "low" | "medium" | "high" => {
  if (isSlowConnection() || prefersReducedData()) return "low";
  if (shouldReduceMotion()) return "medium";
  return "high";
};

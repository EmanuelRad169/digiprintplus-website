"use client";

/**
 * Quote basket.
 *
 * Collects products a visitor wants quoted together. A print job is routinely
 * several products at once (a new business ordering cards + letterhead +
 * booklets is ONE job), so the quote form takes an array of line items and this
 * is where the product pages stage them.
 *
 * sessionStorage, not localStorage: a quote basket is a single-visit intent,
 * not a saved cart. It should not greet someone with stale items next week.
 */

export interface BasketItem {
  slug: string;
  title: string;
  categoryTitle?: string;
  imageUrl?: string;
}

const KEY = "dpp:quote-basket";
export const BASKET_EVENT = "dpp:quote-basket-changed";

function canUseStorage() {
  return typeof window !== "undefined" && !!window.sessionStorage;
}

export function readBasket(): BasketItem[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((i) => i && i.slug) : [];
  } catch {
    return [];
  }
}

function writeBasket(items: BasketItem[]) {
  if (!canUseStorage()) return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* quota or private mode — the form still works, it just won't remember */
  }
  window.dispatchEvent(new CustomEvent(BASKET_EVENT, { detail: items }));
}

/** Adds a product. Returns the resulting basket. Adding twice is a no-op. */
export function addToBasket(item: BasketItem): BasketItem[] {
  const current = readBasket();
  if (current.some((i) => i.slug === item.slug)) return current;
  const next = [...current, item];
  writeBasket(next);
  return next;
}

export function removeFromBasket(slug: string): BasketItem[] {
  const next = readBasket().filter((i) => i.slug !== slug);
  writeBasket(next);
  return next;
}

export function clearBasket() {
  writeBasket([]);
}

export function isInBasket(slug: string): boolean {
  return readBasket().some((i) => i.slug === slug);
}

/** Subscribe to basket changes (same tab via CustomEvent, other tabs via storage). */
export function subscribeToBasket(cb: (items: BasketItem[]) => void) {
  if (typeof window === "undefined") return () => {};
  const onCustom = () => cb(readBasket());
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb(readBasket());
  };
  window.addEventListener(BASKET_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(BASKET_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}

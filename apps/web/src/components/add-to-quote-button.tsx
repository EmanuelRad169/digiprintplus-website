"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus, ShoppingBag } from "lucide-react";
import {
  addToBasket,
  readBasket,
  subscribeToBasket,
  type BasketItem,
} from "../lib/quote-basket";

/**
 * Secondary CTA on a product page: collect this product for a multi-product
 * quote instead of starting a fresh single-product one.
 */
export default function AddToQuoteButton({
  slug,
  title,
  categoryTitle,
  imageUrl,
}: BasketItem) {
  const router = useRouter();
  const [items, setItems] = useState<BasketItem[]>([]);
  const [justAdded, setJustAdded] = useState(false);

  // Read after mount: sessionStorage is unavailable during SSR, and rendering
  // the count on the server would guarantee a hydration mismatch.
  useEffect(() => {
    setItems(readBasket());
    return subscribeToBasket(setItems);
  }, []);

  const added = items.some((i) => i.slug === slug);
  const count = items.length;

  const handleAdd = () => {
    addToBasket({ slug, title, categoryTitle, imageUrl });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2200);
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={added ? () => router.push("/quote") : handleAdd}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-6 py-4 font-semibold transition-all ${
          added
            ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
            : "border-gray-200 bg-white text-gray-800 hover:border-magenta-300 hover:bg-magenta-50 hover:text-magenta-700"
        }`}
        aria-live="polite"
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            In your quote
          </>
        ) : (
          <>
            <Plus className="h-5 w-5" />
            Add to quote
          </>
        )}
      </button>

      {count > 0 && (
        <button
          type="button"
          onClick={() => router.push("/quote")}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-magenta-600 transition-colors hover:text-magenta-700"
        >
          <ShoppingBag className="h-4 w-4" />
          {justAdded ? "Added — " : ""}
          Request a quote for {count} {count === 1 ? "product" : "products"}
        </button>
      )}
    </div>
  );
}

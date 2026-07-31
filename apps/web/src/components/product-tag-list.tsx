import { Tag } from "lucide-react";

/**
 * Full keyword list, always visible (no collapse) so every tag is on screen
 * and indexable. Rendered flat — no card.
 */
export default function ProductTagList({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div>
      <h2 className="flex items-center border-b border-gray-200 pb-3 text-sm font-semibold text-gray-700">
        <Tag className="mr-2 h-4 w-4 text-magenta-500" />
        Related searches &amp; keywords
        <span className="ml-2 font-normal text-gray-400">({tags.length})</span>
      </h2>

      <div className="flex flex-wrap gap-2 pt-4">
        {tags.map((tag: string, index: number) => (
          <span
            key={index}
            className="inline-flex items-center rounded-md bg-sky-50 px-2.5 py-1 text-xs font-medium text-gray-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

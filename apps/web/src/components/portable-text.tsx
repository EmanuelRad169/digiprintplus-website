import { PortableText } from "@portabletext/react";
import Image from "next/image";

const components = {
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-3 first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
        {children}
      </h4>
    ),
    normal: ({ children }: any) => (
      <p className="text-gray-700 text-lg leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-magenta-500 pl-6 italic text-gray-700 my-6 bg-gray-50 py-4">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        className="text-magenta-600 hover:text-magenta-700 underline font-medium"
        target={value.blank ? "_blank" : undefined}
        rel={value.blank ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    strong: ({ children }: any) => (
      <strong className="font-bold text-gray-900">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-gray-700">{children}</em>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc pl-6 mb-6 space-y-3">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal pl-6 mb-6 space-y-3">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="text-gray-700 text-lg leading-relaxed">{children}</li>
    ),
    number: ({ children }: any) => (
      <li className="text-gray-700 text-lg leading-relaxed">{children}</li>
    ),
  },
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?.url) return null;

      return (
        <div className="my-8">
          <Image
            src={value.asset.url}
            alt={value.alt || "Content image"}
            width={800}
            height={400}
            className="rounded-lg w-full"
          />
          {value.caption && (
            <p className="text-sm text-gray-500 mt-2 text-center italic">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
};

interface PortableTextRendererProps {
  content: any[] | any;
  className?: string;
}

export function PortableTextRenderer({
  content,
  className,
}: PortableTextRendererProps) {
  if (!content) {
    return null;
  }

  // Handle single object content by wrapping in array
  const contentArray = Array.isArray(content) ? content : [content];

  // Filter out invalid content blocks
  const validContent = contentArray.filter((block: any) => {
    return block && typeof block === "object" && block._type;
  });

  if (validContent.length === 0) {
    return null;
  }

  return <PortableText value={validContent} components={components} />;
}

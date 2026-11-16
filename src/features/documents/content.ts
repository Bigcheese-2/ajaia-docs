import type { JSONContent } from "@tiptap/react";

/** Plain-text preview of a Tiptap document, for cards and lists. */
export function contentPreview(content: JSONContent, maxLength = 140): string {
  const parts: string[] = [];
  const walk = (node: JSONContent) => {
    if (node.text) parts.push(node.text);
    node.content?.forEach(walk);
    if (node.type === "paragraph" || node.type === "heading") parts.push(" ");
  };
  walk(content);
  const text = parts.join("").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text;
}

export const emptyDocument: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

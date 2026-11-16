import { generateJSON } from "@tiptap/html/server";
import type { JSONContent } from "@tiptap/react";
import DOMPurify from "isomorphic-dompurify";
import mammoth from "mammoth";
import { marked } from "marked";
import { emptyDocument } from "@/features/documents/content";
import { documentExtensions } from "@/features/editor/extensions";

/**
 * File import pipeline: file → HTML → sanitized HTML → editor JSON.
 *
 * Every format goes through HTML so there is one sanitizer and one parser.
 * DOMPurify strips scripts and handlers; parsing against the editor's own
 * schema then drops anything the editor can't render (images, tables…).
 */

export type ImportFormat = "txt" | "md" | "docx";

const ALLOWED_TAGS = [
  "p", "br", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em", "i", "u", "s", "del", "strike",
  "ul", "ol", "li", "blockquote", "pre", "code", "hr",
];

export function formatOf(fileName: string): ImportFormat | null {
  const ext = fileName.slice(fileName.lastIndexOf(".") + 1).toLowerCase();
  return ext === "txt" || ext === "md" || ext === "docx" ? ext : null;
}

/** "Q4 plan.final.docx" → "Q4 plan.final". */
export function titleFromFileName(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  const base = (dot > 0 ? fileName.slice(0, dot) : fileName).trim();
  return base.slice(0, 120) || "Untitled document";
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Blank lines separate paragraphs; single newlines become line breaks. */
export function plainTextToHtml(text: string): string {
  return text
    .replace(/^﻿/, "")
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${escapeHtml(block).replace(/\r?\n/g, "<br>")}</p>`)
    .join("");
}

export function sanitizeHtml(html: string): string {
  const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR: [] });
  // The editor supports H1–H3; keep deeper headings as headings, not plain text.
  return clean.replace(/<(\/?)h[4-6]>/g, "<$1h3>");
}

async function toHtml(format: ImportFormat, data: Buffer): Promise<string> {
  switch (format) {
    case "txt":
      return plainTextToHtml(data.toString("utf8"));
    case "md":
      return marked.parse(data.toString("utf8"), { async: false, gfm: true });
    case "docx":
      return (await mammoth.convertToHtml({ buffer: data })).value;
  }
}

export async function convertFile(fileName: string, data: Buffer): Promise<{ title: string; content: JSONContent }> {
  const format = formatOf(fileName);
  if (!format) throw new Error(`Unsupported file type: ${fileName}`);
  const html = sanitizeHtml(await toHtml(format, data));
  const content = generateJSON(html, documentExtensions) as JSONContent;
  const isEmpty = !content.content?.some((node) => node.content?.length || node.type !== "paragraph");
  return { title: titleFromFileName(fileName), content: isEmpty ? emptyDocument : content };
}

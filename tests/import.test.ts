import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { validateImportFile } from "@/features/import/constants";
import { convertFile, plainTextToHtml, sanitizeHtml, titleFromFileName } from "@/features/import/convert";

const nodeTypes = (content: { content?: { type?: string }[] }) => content.content?.map((n) => n.type);
const allText = (value: unknown): string => JSON.stringify(value);

describe("validateImportFile", () => {
  it("accepts supported types regardless of case", () => {
    expect(validateImportFile({ name: "Notes.MD", size: 10 })).toBeNull();
  });

  it("rejects unsupported types", () => {
    expect(validateImportFile({ name: "slides.pdf", size: 10 })).toMatch(/isn't supported/);
  });

  it("rejects empty and oversized files", () => {
    expect(validateImportFile({ name: "a.txt", size: 0 })).toMatch(/empty/);
    expect(validateImportFile({ name: "a.txt", size: 3 * 1024 * 1024 })).toMatch(/over 2 MB/);
  });
});

describe("helpers", () => {
  it("derives the title from the file name", () => {
    expect(titleFromFileName("Q4 plan.final.docx")).toBe("Q4 plan.final");
    expect(titleFromFileName(".md")).toBe(".md");
  });

  it("escapes HTML in plain text and keeps paragraphs and line breaks", () => {
    expect(plainTextToHtml("a\nb\n\n<b>c</b>")).toBe("<p>a<br>b</p><p>&lt;b&gt;c&lt;/b&gt;</p>");
  });

  it("strips scripts, event handlers and disallowed tags", () => {
    const html = sanitizeHtml('<p onclick="x()">hi</p><script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:x">link</a>');
    expect(html).toBe("<p>hi</p>link");
  });
});

describe("convertFile", () => {
  it("converts Markdown formatting into editor nodes", async () => {
    const { title, content } = await convertFile("notes.md", Buffer.from("# Hello\n\nSome **bold** text.\n\n- one\n- two"));
    expect(title).toBe("notes");
    expect(nodeTypes(content)).toEqual(["heading", "paragraph", "bulletList"]);
    expect(allText(content)).toContain('"type":"bold"');
  });

  it("never lets embedded HTML through as markup", async () => {
    const { content } = await convertFile("x.md", Buffer.from("Hi <script>alert(1)</script><img src=x onerror=alert(1)>"));
    expect(allText(content)).not.toMatch(/script|onerror|image/i);
  });

  it("converts a Word document", async () => {
    const { title, content } = await convertFile("Quarterly report.docx", readFileSync("tests/fixtures/sample.docx"));
    expect(title).toBe("Quarterly report");
    expect(content.content?.[0]).toMatchObject({ type: "heading", attrs: { level: 1 } });
    expect(allText(content)).toContain('"type":"bold"');
    expect(allText(content)).toContain('"type":"italic"');
  });

  it("returns an empty document for a blank file", async () => {
    const { content } = await convertFile("blank.txt", Buffer.from("\n\n  \n"));
    expect(nodeTypes(content)).toEqual(["paragraph"]);
  });

  it("rejects unsupported files", async () => {
    await expect(convertFile("x.pdf", Buffer.from("x"))).rejects.toThrow(/Unsupported/);
  });
});

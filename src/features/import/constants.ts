export const IMPORT_EXTENSIONS = [".txt", ".md", ".docx"] as const;
export const IMPORT_MAX_BYTES = 2 * 1024 * 1024; // 2 MB
export const IMPORT_ACCEPT = IMPORT_EXTENSIONS.join(",");

/** Returns an error message, or null when the file is acceptable. */
export function validateImportFile(file: { name: string; size: number }): string | null {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!(IMPORT_EXTENSIONS as readonly string[]).includes(ext)) {
    return "That file type isn't supported. Use .txt, .md or .docx.";
  }
  if (file.size === 0) return "That file is empty.";
  if (file.size > IMPORT_MAX_BYTES) return "That file is over 2 MB. Try a smaller one.";
  return null;
}

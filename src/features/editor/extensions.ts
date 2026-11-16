import StarterKit from "@tiptap/starter-kit";

/**
 * The document schema, shared by the editor (client) and file import (server)
 * so imported content is parsed into exactly the nodes the editor can render.
 * Anything outside it (images, tables, scripts) is dropped on import.
 */
export const documentExtensions = [StarterKit.configure({ heading: { levels: [1, 2, 3] }, link: false })];

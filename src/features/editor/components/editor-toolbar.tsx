"use client";

import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { Separator } from "@/design-system/primitives/separator";
import { Toggle } from "@/design-system/primitives/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/design-system/primitives/tooltip";

const mod = typeof navigator !== "undefined" && /Mac/.test(navigator.platform) ? "⌘" : "Ctrl+";

type Item = {
  key: string;
  label: string;
  shortcut?: string;
  icon: LucideIcon;
  isActive?: (e: Editor) => boolean;
  canRun?: (e: Editor) => boolean;
  run: (e: Editor) => void;
};

const GROUPS: Item[][] = [
  [
    { key: "undo", label: "Undo", shortcut: `${mod}Z`, icon: Undo2, canRun: (e) => e.can().undo(), run: (e) => e.chain().focus().undo().run() },
    { key: "redo", label: "Redo", shortcut: `${mod}Shift+Z`, icon: Redo2, canRun: (e) => e.can().redo(), run: (e) => e.chain().focus().redo().run() },
  ],
  [1, 2, 3].map((level) => ({
    key: `h${level}`,
    label: `Heading ${level}`,
    shortcut: `${mod}Alt+${level}`,
    icon: [Heading1, Heading2, Heading3][level - 1],
    isActive: (e: Editor) => e.isActive("heading", { level }),
    run: (e: Editor) => e.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run(),
  })),
  [
    { key: "bold", label: "Bold", shortcut: `${mod}B`, icon: Bold, isActive: (e) => e.isActive("bold"), run: (e) => e.chain().focus().toggleBold().run() },
    { key: "italic", label: "Italic", shortcut: `${mod}I`, icon: Italic, isActive: (e) => e.isActive("italic"), run: (e) => e.chain().focus().toggleItalic().run() },
    { key: "underline", label: "Underline", shortcut: `${mod}U`, icon: Underline, isActive: (e) => e.isActive("underline"), run: (e) => e.chain().focus().toggleUnderline().run() },
    { key: "strike", label: "Strikethrough", shortcut: `${mod}Shift+S`, icon: Strikethrough, isActive: (e) => e.isActive("strike"), run: (e) => e.chain().focus().toggleStrike().run() },
  ],
  [
    { key: "bullet", label: "Bulleted list", shortcut: `${mod}Shift+8`, icon: List, isActive: (e) => e.isActive("bulletList"), run: (e) => e.chain().focus().toggleBulletList().run() },
    { key: "ordered", label: "Numbered list", shortcut: `${mod}Shift+7`, icon: ListOrdered, isActive: (e) => e.isActive("orderedList"), run: (e) => e.chain().focus().toggleOrderedList().run() },
    { key: "quote", label: "Quote", shortcut: `${mod}Shift+B`, icon: Quote, isActive: (e) => e.isActive("blockquote"), run: (e) => e.chain().focus().toggleBlockquote().run() },
  ],
];

export function EditorToolbar({ editor }: { editor: Editor }) {
  // Re-render only when active/enabled states change, not on every keystroke.
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      Object.fromEntries(
        GROUPS.flat().map((item) => [
          item.key,
          { active: item.isActive?.(e) ?? false, enabled: item.canRun?.(e) ?? true },
        ]),
      ) as Record<string, { active: boolean; enabled: boolean }>,
  });

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="flex flex-wrap items-center gap-0.5 rounded-xl border bg-background/95 p-1 shadow-sm backdrop-blur"
    >
      {GROUPS.map((group, i) => (
        <div key={i} className="flex items-center gap-0.5">
          {i > 0 && <Separator orientation="vertical" className="mx-1 h-5" />}
          {group.map(({ key, label, shortcut, icon: Icon, run }) => (
            <Tooltip key={key}>
              <TooltipTrigger
                render={
                  <Toggle
                    size="sm"
                    aria-label={label}
                    pressed={state[key].active}
                    disabled={!state[key].enabled}
                    onPressedChange={() => run(editor)}
                  />
                }
              >
                <Icon />
              </TooltipTrigger>
              <TooltipContent>
                {label}
                {shortcut && <span className="ml-2 opacity-60">{shortcut}</span>}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      ))}
    </div>
  );
}

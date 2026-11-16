"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/design-system/primitives/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/design-system/primitives/dialog";
import { cn } from "@/lib/utils";
import { importDocumentAction } from "../actions";
import { IMPORT_ACCEPT, validateImportFile } from "../constants";

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ImportDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = (f: File | undefined) => {
    if (!f) return;
    const problem = validateImportFile(f);
    setError(problem);
    setFile(problem ? null : f);
  };

  const reset = () => {
    setFile(null);
    setError(null);
    setPending(false);
  };

  const onImport = async () => {
    if (!file) return;
    setPending(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    // On success the action redirects to the new document; it only returns on failure.
    const result = await importDocumentAction(formData);
    if (result && !result.ok) {
      setError(result.error);
      setPending(false);
      toast.error("Import failed");
      return;
    }
    toast.success(`Imported “${file.name}”`);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger render={<Button variant="outline" size="lg" />}>
        <Upload /> Import file
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import a file</DialogTitle>
          <DialogDescription>Turn a text, Markdown or Word file into a new editable document.</DialogDescription>
        </DialogHeader>

        {file ? (
          <div className="flex items-center gap-3 rounded-lg border bg-background p-3 animate-in fade-in-0 duration-150">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              <FileText className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
            </div>
            <Button variant="ghost" size="icon-sm" aria-label="Remove file" onClick={reset} disabled={pending}>
              <X />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pick(e.dataTransfer.files[0]);
            }}
            className={cn(
              "flex w-full flex-col items-center gap-2 rounded-lg border border-dashed bg-background px-6 py-10 text-center transition-colors duration-150 outline-none hover:border-primary/50 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50",
              dragging && "border-primary bg-primary/5",
              error && "border-destructive/60",
            )}
          >
            <span className="flex size-10 items-center justify-center rounded-lg border bg-surface">
              <Upload className="size-5 text-muted-foreground" />
            </span>
            <span className="text-sm font-medium">Drop a file here or browse</span>
            <span className="text-xs text-muted-foreground">Supports .txt, .md and .docx · max 2 MB</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={IMPORT_ACCEPT}
          className="hidden"
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button onClick={onImport} disabled={!file || pending}>
            {pending && <Loader2 className="animate-spin" />}
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

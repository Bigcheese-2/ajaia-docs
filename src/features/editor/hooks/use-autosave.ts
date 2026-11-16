"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SaveState = "saved" | "unsaved" | "saving" | "error";

/**
 * Debounced autosave. Call `schedule(value)` on every change; the latest value
 * is saved `delay` ms after the user stops typing. Saves never overlap.
 */
export function useAutosave<T>(save: (value: T) => Promise<boolean>, delay = 800) {
  const [state, setState] = useState<SaveState>("saved");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<{ value: T } | null>(null);
  const inFlight = useRef(false);
  const saveRef = useRef(save);
  saveRef.current = save;

  const flush = useCallback(async () => {
    if (inFlight.current || !pending.current) return;
    const { value } = pending.current;
    pending.current = null;
    inFlight.current = true;
    setState("saving");
    const ok = await saveRef.current(value).catch(() => false);
    inFlight.current = false;
    if (!ok) {
      pending.current ??= { value }; // keep it so "Retry" can resend
      setState("error");
    } else if (pending.current) {
      void flush(); // more edits arrived while saving
    } else {
      setState("saved");
    }
  }, []);

  const schedule = useCallback(
    (value: T) => {
      pending.current = { value };
      setState("unsaved");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(flush, delay);
    },
    [delay, flush],
  );

  // Warn before closing the tab with unsaved edits.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state !== "saved") e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [state]);

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  return { state, schedule, retry: flush };
}

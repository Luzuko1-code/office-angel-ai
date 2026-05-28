import type { UIMessage } from "ai";
import { useCallback, useEffect, useState } from "react";
import type { ModeId } from "./modes";

export interface Thread {
  id: string;
  title: string;
  mode: ModeId;
  updatedAt: number;
  messages: UIMessage[];
}

const STORAGE_KEY = "workmate.threads.v1";

function readAll(): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Thread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(threads: Thread[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
    window.dispatchEvent(new CustomEvent("workmate-threads-changed"));
  } catch {
    /* ignore quota errors */
  }
}

export function createThreadId(): string {
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createThread(mode: ModeId): Thread {
  return {
    id: createThreadId(),
    title: "New conversation",
    mode,
    updatedAt: Date.now(),
    messages: [],
  };
}

export function saveThread(thread: Thread) {
  const all = readAll();
  const idx = all.findIndex((t) => t.id === thread.id);
  if (idx >= 0) all[idx] = thread;
  else all.unshift(thread);
  all.sort((a, b) => b.updatedAt - a.updatedAt);
  writeAll(all);
}

export function getThread(id: string): Thread | undefined {
  return readAll().find((t) => t.id === id);
}

export function deleteThread(id: string) {
  writeAll(readAll().filter((t) => t.id !== id));
}

export function renameThread(id: string, title: string) {
  const all = readAll();
  const t = all.find((x) => x.id === id);
  if (!t) return;
  t.title = title.slice(0, 80);
  t.updatedAt = Date.now();
  writeAll(all);
}

export function deriveTitle(messages: UIMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New conversation";
  const text = first.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim();
  if (!text) return "New conversation";
  return text.length > 60 ? text.slice(0, 57) + "..." : text;
}

export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    setThreads(readAll());
    const handler = () => setThreads(readAll());
    window.addEventListener("workmate-threads-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("workmate-threads-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const refresh = useCallback(() => setThreads(readAll()), []);

  return { threads, refresh };
}

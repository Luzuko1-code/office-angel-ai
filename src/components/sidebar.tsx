"use client";

import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { MODE_LIST, MODES, type ModeId, DEFAULT_MODE } from "@/lib/modes";
import {
  createThread,
  deleteThread,
  saveThread,
  useThreads,
} from "@/lib/threads";
import { cn } from "@/lib/utils";
import logo from "@/assets/workmate-logo.png";

export function Sidebar() {
  const { threads } = useThreads();
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { threadId?: string };
  const activeId = params.threadId;

  const startNew = (mode: ModeId) => {
    const t = createThread(mode);
    saveThread(t);
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    deleteThread(id);
    if (activeId === id) navigate({ to: "/" });
  };

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <Link
        to="/"
        className="flex items-center gap-2 border-b border-sidebar-border px-4 py-4"
      >
        <img src={logo} alt="" width={32} height={32} />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">Workmate</span>
          <span className="text-[11px] text-muted-foreground">
            AI workplace assistant
          </span>
        </div>
      </Link>

      <div className="px-3 pt-4">
        <button
          onClick={() => startNew(DEFAULT_MODE)}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> New conversation
        </button>
      </div>

      <div className="mt-5 px-3">
        <p className="px-1 pb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          Start a task
        </p>
        <div className="grid gap-1">
          {MODE_LIST.map((m) => (
            <button
              key={m.id}
              onClick={() => startNew(m.id)}
              className="flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-sidebar-foreground/90 transition hover:bg-sidebar-accent"
            >
              <m.icon className="h-4 w-4 text-primary" />
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col px-3 pb-3">
        <p className="px-1 pb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          History
        </p>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {threads.length === 0 ? (
            <p className="px-2 py-3 text-xs text-muted-foreground">
              No conversations yet.
            </p>
          ) : (
            <ul className="space-y-1">
              {threads.map((t) => {
                const Icon = MODES[t.mode].icon;
                const active = t.id === activeId;
                return (
                  <li key={t.id}>
                    <div
                      className={cn(
                        "group flex items-center gap-2 rounded-md px-2 py-2 text-sm transition",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/60",
                      )}
                    >
                      <Link
                        to="/chat/$threadId"
                        params={{ threadId: t.id }}
                        className="flex min-w-0 flex-1 items-center gap-2"
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0 text-primary/80" />
                        <span className="truncate">{t.title}</span>
                      </Link>
                      <button
                        onClick={(e) => handleDelete(e, t.id)}
                        aria-label="Delete conversation"
                        className="rounded p-1 text-muted-foreground opacity-0 transition hover:bg-destructive/20 hover:text-destructive group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-sidebar-border px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
        Use responsibly. Don't paste secrets you wouldn't share in a team doc.
      </div>
    </aside>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/sidebar";
import { MODE_LIST, DEFAULT_MODE } from "@/lib/modes";
import { createThread, saveThread } from "@/lib/threads";
import { useNavigate } from "@tanstack/react-router";
import logo from "@/assets/workmate-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workmate — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Workmate is an AI-powered workplace assistant for email drafting, meeting summaries, task planning, and research.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const start = (modeId: typeof DEFAULT_MODE) => {
    const t = createThread(modeId);
    saveThread(t);
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full max-w-4xl flex-col items-center justify-center px-6 py-16">
          <img src={logo} alt="Workmate logo" width={88} height={88} className="mb-6" />
          <h1 className="text-balance text-center text-4xl font-semibold tracking-tight">
            Your AI assistant for everyday work
          </h1>
          <p className="mt-4 max-w-xl text-balance text-center text-muted-foreground">
            Draft emails, summarize meetings, plan tasks, and dig into research —
            all in one conversation. Pick where to start:
          </p>

          <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MODE_LIST.map((m) => (
              <button
                key={m.id}
                onClick={() => start(m.id)}
                className="group rounded-xl border border-border bg-card p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10"
              >
                <m.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 text-sm font-semibold">{m.label}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {m.description}
                </p>
              </button>
            ))}
          </div>

          <p className="mt-10 max-w-xl text-balance text-center text-xs text-muted-foreground">
            Workmate uses AI and can make mistakes. Review outputs before sending,
            and avoid sharing confidential information.
          </p>
        </div>
      </main>
    </div>
  );
}

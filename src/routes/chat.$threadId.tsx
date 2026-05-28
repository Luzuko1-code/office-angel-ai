import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { ChatWindow } from "@/components/chat-window";
import { getThread, type Thread } from "@/lib/threads";

export const Route = createFileRoute("/chat/$threadId")({
  component: ChatThreadPage,
});

function ChatThreadPage() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState<Thread | null | undefined>(undefined);

  useEffect(() => {
    const t = getThread(threadId);
    if (!t) {
      setThread(null);
      return;
    }
    setThread(t);
  }, [threadId]);

  useEffect(() => {
    if (thread === null) {
      navigate({ to: "/" });
    }
  }, [thread, navigate]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {thread ? (
          <ChatWindow key={thread.id} thread={thread} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading conversation...
          </div>
        )}
      </main>
    </div>
  );
}

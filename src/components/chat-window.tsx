"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { MODES, type ModeId } from "@/lib/modes";
import { deriveTitle, saveThread, type Thread } from "@/lib/threads";
import logo from "@/assets/workmate-logo.png";

export function ChatWindow({ thread }: { thread: Thread }) {
  const mode = MODES[thread.mode];
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat", body: { mode: thread.mode } }),
    [thread.mode],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: thread.id,
    messages: thread.messages,
    transport,
  });

  // Persist to localStorage as messages change (after streaming settles)
  const persistedRef = useRef<string>("");
  useEffect(() => {
    if (status === "streaming" || status === "submitted") return;
    const snapshot = JSON.stringify(messages);
    if (snapshot === persistedRef.current) return;
    persistedRef.current = snapshot;
    saveThread({
      ...thread,
      messages: messages as UIMessage[],
      title: deriveTitle(messages as UIMessage[]) || thread.title,
      updatedAt: Date.now(),
    });
  }, [messages, status, thread]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  void textareaRef;

  const handleSubmit = async (msg: PromptInputMessage) => {
    const text = msg.text.trim();
    if (!text) return;
    await sendMessage({ text });
  };

  const handleStarter = async (text: string) => {
    await sendMessage({ text });
  };

  const isBusy = status === "submitted" || status === "streaming";

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-border bg-card/40 px-6 py-3 backdrop-blur">
        <mode.icon className="h-5 w-5 text-primary" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{mode.label}</span>
          <span className="text-xs text-muted-foreground">{mode.description}</span>
        </div>
      </header>

      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <img
                src={logo}
                alt=""
                width={64}
                height={64}
                className="mb-3 opacity-90"
              />
              <h3 className="text-base font-semibold">
                How can I help with {mode.short.toLowerCase()}?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick a starter or just type your own request.
              </p>
              <div className="mt-6 grid w-full max-w-xl gap-2">
                {mode.starters.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStarter(s)}
                    className="rounded-lg border border-border bg-card/60 px-4 py-3 text-left text-sm text-foreground transition hover:border-primary/60 hover:bg-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              if (m.role === "user") {
                return (
                  <Message key={m.id} from="user">
                    <MessageContent>
                      <p className="whitespace-pre-wrap text-sm">{text}</p>
                    </MessageContent>
                  </Message>
                );
              }
              return (
                <Message key={m.id} from="assistant">
                  <MessageContent className="!bg-transparent !p-0">
                    {text ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <Shimmer>Thinking...</Shimmer>
                    )}
                  </MessageContent>
                </Message>
              );
            })
          )}

          {isBusy &&
            messages.length > 0 &&
            messages[messages.length - 1]?.role === "user" && (
              <Message from="assistant">
                <MessageContent className="!bg-transparent !p-0">
                  <Shimmer>Thinking...</Shimmer>
                </MessageContent>
              </Message>
            )}

          {error && (
            <div className="mt-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error.message || "Something went wrong. Please try again."}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border bg-background/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              placeholder={mode.placeholder}
              disabled={isBusy}
              autoFocus
            />
            <PromptInputFooter className="justify-between">
              <span className="text-xs text-muted-foreground">
                AI can make mistakes. Review before sending.
              </span>
              <PromptInputSubmit status={status} disabled={isBusy} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}

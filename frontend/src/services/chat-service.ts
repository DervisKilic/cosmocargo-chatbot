import { api, ApiError } from "./api";

export type ChatRole = "user" | "assistant" | "bot" | "system";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatReply {
  reply: string;
}

export async function askChat(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await api.post<ChatReply>("/chat", {
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    return (response.data as unknown as ChatReply).reply;
  } catch (err) {
    if (err instanceof ApiError) {
      // Try to extract a helpful message from ProblemDetails or backend payload
      const data = err.data as any;
      const detail = (data && (data.detail || data.title || data.message)) as string | undefined;
      throw new Error(detail || "Ett fel uppstod vid chattanropet.");
    }
    throw err as Error;
  }
}

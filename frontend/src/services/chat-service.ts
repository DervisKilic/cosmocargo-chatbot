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
      messages,
    });

    return response.data.reply;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      const data = err.data;
      let detail: string | undefined;

      if (data && typeof data === "object") {
        const obj = data as Record<string, unknown>;
        if (typeof obj.detail === "string") detail = obj.detail;
        else if (typeof obj.title === "string") detail = obj.title;
        else if (typeof obj.message === "string") detail = obj.message;
      } else if (typeof data === "string" && data.trim().length > 0) {
        detail = data;
      }

      throw new Error(
        detail ?? err.message ?? "Ett fel uppstod vid chattanropet."
      );
    }

    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Ett fel uppstod vid chattanropet.");
  }
}


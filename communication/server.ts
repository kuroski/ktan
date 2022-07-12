import { ChannelMessage, ApiTextMessage } from "@/communication/types.ts";
function Server() {
  return {
    subscribeMessages: (
      roomId: string,
      onMessage: (message: ChannelMessage) => void
    ) => {
      const events = new EventSource(`/api/connect/${roomId}`);
      const listener = (e: MessageEvent) => {
        const msg = JSON.parse(e.data) as ChannelMessage;
        onMessage(msg);
      };
      events.addEventListener("message", listener);
      return {
        unsubscribe() {
          events.removeEventListener("message", listener);
        },
      };
    },

    sendMessage: (roomId: string, message: string) => {
      const data: ApiTextMessage = {
        kind: "text",
        message,
        roomId,
      };
      fetch("/api/send", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    createRoom: async (name: string) => {
      const res = await fetch("/api/create_room", {
        method: "POST",
        body: name,
      });
      const text = await res.text();
      if (!res.ok) {
        alert(text); // Nothing fancy
        throw new Error(text);
      }
      return text;
    },
  };
}

export default Server;

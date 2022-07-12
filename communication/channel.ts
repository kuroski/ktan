import {
  ChannelMessage,
  RoomTextChannelMessage,
} from "@/communication/types.ts";

function RoomChannel(roomId: string) {
  const channel = new BroadcastChannel(roomId);

  return {
    close: () => channel.close(),
    onMessage: (handler: (message: ChannelMessage) => void) => {
      const listener = (e: MessageEvent) => {
        handler(e.data);
      };

      channel.addEventListener("message", listener);
      return {
        unsubscribe: () => channel.removeEventListener("message", listener),
      };
    },
    sendText: (message: Omit<RoomTextChannelMessage, "kind">) => {
      channel.postMessage({
        kind: "text",
        ...message,
      });
    },
  };
}

export default RoomChannel;

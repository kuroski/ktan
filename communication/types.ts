export type ChannelMessage = RoomTextChannelMessage;

export type RoomTextChannelMessage = MessageView & {
  kind: "text";
};

export type MessageView = {
  from: string;
  createdAt: string;
  message: string;
};

export type ApiSendMessage = ApiTextMessage;

export interface ApiTextMessage {
  kind: "text";
  roomId: string;
  message: string;
}

export interface RoomView {
  roomId: string;
  name: string;
  lastMessageAt: string;
}

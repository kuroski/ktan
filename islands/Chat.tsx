/** @jsx h */
/** @jsxFrag Fragment */
import server from "@/communication/server.ts";
import { tw } from "@twind";
import { Fragment, h } from "preact";
import { useEffect, useReducer, useRef, useState } from "preact/hooks";
import twas from "twas";
import type { MessageView } from "../communication/types.ts";

export default function Chat({
  roomId,
  roomName,
  initialMessages,
  user,
}: {
  roomId: string;
  roomName: string;
  initialMessages: MessageView[];
  user: string;
}) {
  const messagesContainer = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [messages, addMessage] = useReducer<MessageView[], MessageView>(
    (msgs, msg) => [...msgs, msg],
    initialMessages
  );

  useEffect(() => {
    Notification.requestPermission();

    const subscription = server().subscribeMessages(roomId, (msg) => {
      switch (msg.kind) {
        case "text":
          addMessage(msg);
          new Notification(`New message from ${msg.from}`, {
            body: msg.message,
          });
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    const container = messagesContainer.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages.length]);

  const send = () => {
    if (input === "") {
      return;
    }
    server().sendMessage(roomId, input);
    setInput("");
  };

  return (
    <>
      <div
        class={tw`w-1/2 h-2/3 rounded-2xl mb-5 pl-6 flex flex-col pt-4 pb-2`}
      >
        <div
          class={tw`h-8 flex-none pl-1 pr-7 mb-16 flex justify-between items-center`}
        >
          <a href="/">Back</a>
          <div class={tw`font-medium text-lg`}>{roomName}</div>
          <div />
        </div>

        <div class={tw`flex-auto overflow-y-scroll`} ref={messagesContainer}>
          {messages.map((msg) => (
            <Message message={msg} />
          ))}
        </div>
      </div>
      <div class={tw`w-1/2 h-16 flex-none rounded-full flex items-center`}>
        <ChatInput
          input={input}
          onInput={(input) => {
            setInput(input);
          }}
          onSend={send}
        />
      </div>
    </>
  );
}

function ChatInput({
  input,
  onInput,
  onSend,
}: {
  input: string;
  onInput: (input: string) => void;
  onSend: () => void;
}) {
  return (
    <>
      <input
        type="text"
        placeholder="Message"
        class={tw`block mx-6 w-full bg-transparent outline-none focus:text-gray-700`}
        value={input}
        onInput={(e) => onInput(e.currentTarget.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
      />
      <button onClick={onSend}>
        <svg
          class={tw`w-5 h-5 text-gray-500 origin-center transform rotate-90 mr-6`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </>
  );
}

function Message({ message }: { message: MessageView }) {
  return (
    <div class={tw`flex mb-4.5`}>
      <div>
        <p class={tw`flex items-baseline mb-1.5`}>
          <span class={tw`mr-2 font-bold`}>{message.from}</span>
          <span class={tw`text-xs text-gray-400 font-extralight`}>
            {twas(new Date(message.createdAt).getTime())}
          </span>
        </p>
        <p class={tw`text-sm text-gray-800`}>{message.message}</p>
      </div>
    </div>
  );
}

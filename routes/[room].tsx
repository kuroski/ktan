/** @jsx h */
import { Handler, HandlerContext, PageProps } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import Chat from "@/islands/Chat.tsx";
import { h } from "preact";
import { v4 } from "https://esm.sh/uuid@8.3.2";

interface Data {
  roomName: string;
  user: string;
}

export const handler: Handler<Data> = async (
  req: Request,
  ctx: HandlerContext<Data>
): Promise<Response> => {
  // Get cookie from request header and parse it
  const accessToken = getCookies(req.headers)["ktan_token"];
  if (!accessToken) {
    const token = v4();
    const response = await ctx.render({
      user: token,
      roomName: ctx.params.room,
    });
    setCookie(response.headers, {
      name: "ktan_token",
      value: token,
      maxAge: 60 * 60,
      //   maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    return response;
  }
  if (ctx.params.room.length === 0) {
    return new Response("Invalid room id", { status: 400 });
  }

  return ctx.render({
    user: accessToken,
    roomName: ctx.params.room,
  });
};

export default function Room({ data, params }: PageProps<Data>) {
  return (
    <div>
      <Chat
        roomId={params.room}
        initialMessages={[]}
        roomName={data.roomName}
        user={data.user}
      />
    </div>
  );
}

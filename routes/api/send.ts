import { HandlerContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { emojify } from "emojify";
import RoomChannel from "@/communication/channel.ts";
import { ApiSendMessage } from "@/communication/types.ts";

export async function handler(
  req: Request,
  _ctx: HandlerContext
): Promise<Response> {
  const accessToken = getCookies(req.headers)["ktan_token"];
  if (!accessToken) {
    return new Response("Not signed in", { status: 401 });
  }
  const data = (await req.json()) as ApiSendMessage;
  const channel = RoomChannel(data.roomId);

  const message = emojify(data.message);
  channel.sendText({
    message: message,
    from: accessToken,
    createdAt: new Date().toISOString(),
  });
  channel.close();

  return new Response("OK");
}

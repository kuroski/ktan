/** @jsx h */
/** @jsxFrag Fragment */
import { tw } from "@twind";
import { Fragment, h } from "preact";
import { Handlers } from "$fresh/server.ts";
import { zfd } from "zodFormData";
import { Status } from "status";

const Data = zfd.formData({
  roomId: zfd.text(),
});

type Data = typeof Data._output;

export const handler: Handlers<Data> = {
  async POST(req) {
    // deno will die without this line
    // yeah... it's weird: https://github.com/denoland/deno/issues/15107#issuecomment-1181471447
    req.headers;
    const body = Data.parse(await req.formData());
    const url = new URL(req.url);
    url.pathname = `/${body.roomId}`;
    return Response.redirect(url, Status.TemporaryRedirect);
  },
};

export default function Main() {
  return (
    <>
      <div
        class={tw`max-w-xs mx-auto flex flex-col gap-6 justify-center h-screen text-gray-600`}
      >
        <form method="POST" action="/">
          <div
            class={tw`flex flex-col p-1 overflow-hidden border rounded-lg dark:border-gray-600 md:flex-row dark:focus-within:border-blue-300 focus-within:ring focus-within:ring-opacity-40 focus-within:border-blue-400 focus-within:ring-blue-300`}
          >
            <input
              autofocus
              type="text"
              name="roomId"
              class={tw`px-6 py-2 text-gray-700 placeholder-gray-500 bg-white outline-none dark:bg-gray-800 dark:placeholder-gray-400 focus:placeholder-transparent dark:focus:placeholder-transparent`}
            />
            <button
              type="submit"
              class={tw`px-4 py-3 text-sm font-medium tracking-wider text-gray-100 uppercase transition-colors duration-200 transform bg-gray-700 rounded-lg hover:bg-gray-600 focus:bg-gray-600 focus:outline-none`}
            >
              Join
            </button>
          </div>
        </form>
        <a
          href="/new"
          class={tw`w-full text-center px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80`}
        >
          New Room
        </a>
      </div>
    </>
  );
}

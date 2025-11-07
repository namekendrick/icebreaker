import { createMcpHandler } from "mcp-handler";

import { baseURL } from "@/baseUrl";
import { getQuestions } from "@/db/question";
import { createRoom } from "@/features/daily/server/create-room";

const getAppsSdkCompatibleHtml = async (baseUrl, path) => {
  const result = await fetch(`${baseUrl}${path}`);
  return await result.text();
};

function widgetMeta(widget) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": false,
    "openai/resultCanProduceWidget": true,
    "openai/questions": widget.questions,
  };
}

const handler = createMcpHandler(async (server) => {
  const html = await getAppsSdkCompatibleHtml(baseURL, "/");
  const questions = await getQuestions();

  const roomWidget = {
    id: "create_room",
    title: "Create Room",
    templateUri: "ui://widget/room-template.html",
    invoking: "Creating your room...",
    invoked: "Room created successfully",
    html: html,
    questions: questions,
    description:
      "Creates a new icebreaker room with a button to join the room.",
    widgetDomain: "https://nextjs.org/docs",
  };

  server.registerResource(
    "room-widget",
    roomWidget.templateUri,
    {
      title: roomWidget.title,
      description: roomWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": roomWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${roomWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": roomWidget.description,
            "openai/widgetPrefersBorder": true,
            "openai/widgetDomain": roomWidget.widgetDomain,
          },
        },
      ],
    }),
  );

  server.registerTool(
    roomWidget.id,
    {
      title: roomWidget.title,
      description: "Create a new icebreaker room.",
      _meta: widgetMeta(roomWidget),
    },
    async () => {
      const result = await createRoom();

      if (result.status !== 200 && result.status !== 201) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to create room: ${result.message}`,
            },
          ],
          isError: true,
        };
      }

      const room = result.data;

      return {
        content: [
          {
            type: "text",
            text: `Room created successfully! Room code: ${room.code}. Share this link with your team: ${process.env.NEXT_PUBLIC_APP_URL}/room/${room.code}`,
          },
        ],
        structuredContent: {
          roomCode: room.code,
          roomUrl: `${process.env.NEXT_PUBLIC_APP_URL}/room/${room.code}`,
          timestamp: new Date().toISOString(),
        },
        _meta: widgetMeta(roomWidget),
      };
    },
  );
});

export const GET = handler;
export const POST = handler;

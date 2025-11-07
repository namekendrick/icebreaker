"use server";

import { prisma } from "@workspace/database";

export const getRoom = async (code) => {
  const room = await prisma.room.findUnique({
    where: { code },
    include: {
      participants: {
        include: {
          response: {
            include: {
              question: true,
            },
          },
        },
      },
    },
  });

  return room;
};

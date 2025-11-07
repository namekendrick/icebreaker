"use server";

import { prisma } from "@workspace/database";

export const addParticipant = async (values) => {
  const { name, roomCode } = values;

  try {
    const createdParticipant = await prisma.participant.create({
      data: {
        name,
        room: {
          connect: {
            code: roomCode,
          },
        },
      },
    });

    const room = await prisma.room.findUnique({
      where: { code: roomCode },
      include: {
        participants: true,
      },
    });

    return {
      status: 201,
      message: "Participant added successfully",
      data: {
        room,
        participant: createdParticipant,
      },
    };
  } catch (error) {
    console.error("Error adding participant:", error);
    return { status: 500, message: "Failed to add participant" };
  }
};

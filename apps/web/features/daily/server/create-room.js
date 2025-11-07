"use server";

import { prisma } from "@workspace/database";
import { generateRoomCode } from "@/lib/utils";

export const createRoom = async (values) => {
  const { name } = values;

  try {
    let roomCode;
    let isCodeUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isCodeUnique && attempts < maxAttempts) {
      roomCode = generateRoomCode();

      const existingRoom = await prisma.room.findUnique({
        where: { code: roomCode },
      });

      if (!existingRoom) isCodeUnique = true;

      attempts++;
    }

    if (!isCodeUnique) {
      throw new Error(
        "Failed to generate unique room code after multiple attempts",
      );
    }

    const roomData = { code: roomCode };

    if (name) {
      roomData.participants = {
        create: {
          name,
        },
      };
    }

    const room = await prisma.room.create({
      data: roomData,
      include: {
        participants: true,
      },
    });

    const createdParticipant = room.participants[0] || null;

    return {
      status: 201,
      message: "Room created successfully",
      data: {
        room,
        participant: createdParticipant,
      },
    };
  } catch (error) {
    console.error("Error creating room:", error);
    return { status: 500, message: "Failed to create room" };
  }
};

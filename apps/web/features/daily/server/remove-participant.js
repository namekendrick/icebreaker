"use server";

import { prisma } from "@workspace/database";

export const removeParticipant = async (values) => {
  const { id } = values;

  try {
    const room = await prisma.participant.delete({
      where: { id },
    });

    return {
      status: 201,
      message: "Participant removed successfully",
      data: room,
    };
  } catch (error) {
    console.error("Error removing participant:", error);
    return { status: 500, message: "Failed to remove participant" };
  }
};

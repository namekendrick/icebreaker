"use server";

import { prisma } from "@workspace/database";

export const getQuestions = async () => {
  const questions = await prisma.question.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return questions;
};

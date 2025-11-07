import * as z from "zod";

export const addParticipantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Please enter your name" })
    .max(50, { message: "Name must be less than 50 characters" }),
});

export const saveResponseSchema = z.object({
  text: z.string().trim().min(1, { message: "Please enter a response" }),
});

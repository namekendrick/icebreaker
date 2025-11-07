"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { useAddParticipant } from "@/features/daily/api/use-add-participant";
import { addParticipantSchema } from "@/features/daily/schemas";

export const AddParticipantForm = ({ room }) => {
  const { mutate: addParticipant, isPending } = useAddParticipant();

  const form = useForm({
    resolver: zodResolver(addParticipantSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values) => {
    addParticipant(
      {
        name: values.name,
        roomCode: room.code,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-8">
      <div className="space-y-3 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <UserPlus className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Join the conversation
        </h2>
        <p className="max-w-md text-gray-600">
          Enter your name to participate in today&apos;s question.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your name"
                    className="py-3 text-center text-lg"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full py-3 text-base font-semibold"
            disabled={isPending}
          >
            {isPending ? "Joining..." : "Join Room"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Send, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@workspace/ui/components/form";
import { Textarea } from "@workspace/ui/components/textarea";
import { useCreateRoom } from "@/features/daily/api/use-create-room";
import { useSaveResponse } from "@/features/daily/api/use-save-response";
import { AddParticipantForm } from "@/features/daily/components/add-participant-form";
import { useDailyQuestionState } from "@/features/daily/hooks/use-daily-question-state";
import { useDailyQuestion } from "@/features/daily/providers/daily-question-provider";
import { saveResponseSchema } from "@/features/daily/schemas";

export const DailyQuestion = ({ room }) => {
  const { currentQuestion } = useDailyQuestion();
  const { getCurrentParticipantId, isParticipantInRoom, hasHydrated } =
    useDailyQuestionState();
  const { mutate: saveResponseMutation } = useSaveResponse();
  const { mutate: createRoom, isPending: isCreatingRoom } = useCreateRoom();
  const [isEditing, setIsEditing] = useState(false);

  const currentParticipantId = getCurrentParticipantId(room?.code);
  const isUserInRoom = hasHydrated ? isParticipantInRoom(room?.code) : false;
  const currentParticipant = room?.participants?.find(
    (participant) => participant.id === currentParticipantId,
  );
  const existingResponse = currentParticipant?.response;

  const roomQuestion =
    existingResponse?.question ||
    room?.participants?.find((p) => p.response?.question)?.response?.question;

  const question = roomQuestion || currentQuestion;

  const isHistoricalRoom =
    roomQuestion && currentQuestion && roomQuestion.id !== currentQuestion.id;

  const form = useForm({
    resolver: zodResolver(saveResponseSchema),
    defaultValues: {
      text: "",
    },
  });

  useEffect(() => {
    if (existingResponse?.text) {
      form.reset({ text: existingResponse.text });
    }
  }, [existingResponse?.text, form]);

  const saveResponse = (values) => {
    const participantId = getCurrentParticipantId(room?.code);

    saveResponseMutation(
      {
        text: values.text,
        participantId,
        questionId: question.id,
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleEditClick = () => setIsEditing(true);

  const handleCreateNewRoom = () => {
    const currentParticipantId = getCurrentParticipantId(room?.code);
    const currentParticipant = room?.participants?.find(
      (p) => p.id === currentParticipantId,
    );

    createRoom({ name: currentParticipant?.name || null });
  };

  if (!question) return null;

  if (!isUserInRoom && !isHistoricalRoom && hasHydrated && currentQuestion)
    return <AddParticipantForm room={room} />;

  const isFormDisabled =
    !currentParticipantId || (existingResponse && !isEditing);
  const showEditIcon = existingResponse && !isEditing;
  const showSendIcon = !existingResponse || isEditing;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-16">
      <h1
        key={question.id}
        className="animate-in fade-in-0 slide-in-from-bottom-8 flex min-h-[200px] max-w-4xl items-center justify-center text-center text-6xl leading-none font-black tracking-tight text-gray-900 duration-500 md:text-7xl"
      >
        <span>{question.text}</span>
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(saveResponse)}
          className="relative w-full max-w-3xl"
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Share your thoughts..."
                    disabled={isFormDisabled}
                    className={`min-w-full resize-none border-none pr-14 shadow-md ${
                      isFormDisabled
                        ? "cursor-not-allowed bg-gray-50 text-gray-700"
                        : ""
                    }`}
                    rows={4}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {showEditIcon && (
            <Button
              type="button"
              onClick={handleEditClick}
              className="absolute right-3 bottom-3 bg-blue-600 p-2 hover:bg-blue-700"
            >
              <Edit size={20} />
            </Button>
          )}
          {showSendIcon && (
            <Button
              type="submit"
              disabled={isFormDisabled}
              className="absolute right-3 bottom-3 bg-emerald-600 p-2"
            >
              <Send size={20} />
            </Button>
          )}
        </form>
      </Form>

      {isHistoricalRoom && (
        <Button
          variant="outline"
          onClick={handleCreateNewRoom}
          disabled={isCreatingRoom}
          className="mt-4"
        >
          <Plus className="mr-2 h-4 w-4" />
          {isCreatingRoom ? "Creating room..." : "Answer today's question"}
        </Button>
      )}
    </div>
  );
};

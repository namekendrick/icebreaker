"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useGetRoom } from "@/features/daily/api/use-get-room";
import { DailyQuestion } from "@/features/daily/components/daily-question";
import { ParticipantResponse } from "@/features/daily/components/participant-response";
import { useDailyQuestionState } from "@/features/daily/hooks/use-daily-question-state";
import { useDailyQuestion } from "@/features/daily/providers/daily-question-provider";

export const RoomClient = ({ roomCode, defaultOpen }) => {
  const { data: room, isLoading } = useGetRoom(roomCode);
  const { currentQuestion } = useDailyQuestion();

  const {
    isViewingParticipantResponse,
    clearViewingParticipant,
    clearViewedResponses,
    setViewingParticipantId,
    getParticipantsWithResponses,
  } = useDailyQuestionState();

  const roomQuestion = room?.participants?.find((p) => p.response?.question)
    ?.response?.question;

  const isHistoricalRoom =
    roomQuestion && currentQuestion && roomQuestion.id !== currentQuestion.id;

  const isCheckingRoomType = roomQuestion && !currentQuestion;

  useEffect(() => {
    if (!isLoading && !room) redirect("/");
  }, [isLoading, room]);

  useEffect(() => {
    if (isHistoricalRoom && room?.participants) {
      const participantsWithResponses = getParticipantsWithResponses(
        room.participants,
      );

      if (
        participantsWithResponses.length > 0 &&
        !isViewingParticipantResponse()
      ) {
        const randomIndex = Math.floor(
          Math.random() * participantsWithResponses.length,
        );
        setViewingParticipantId(participantsWithResponses[randomIndex].id);
      }
    }
  }, [
    isHistoricalRoom,
    room,
    getParticipantsWithResponses,
    setViewingParticipantId,
    isViewingParticipantResponse,
  ]);

  if (isLoading || isCheckingRoomType) {
    return (
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="flex h-screen">
          <div className="w-64 border-r bg-gray-50 p-4">
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 p-8">
            <Skeleton className="mx-auto h-32 w-full max-w-4xl" />
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (!room) return null;

  const participantsWithResponses = getParticipantsWithResponses(
    room?.participants || [],
  );

  const hasResponses = participantsWithResponses.length > 0;

  const showingParticipantResponse =
    (isViewingParticipantResponse() || isHistoricalRoom) && hasResponses;

  const handleBackToQuestion = () => {
    clearViewingParticipant();
    if (room?.code) clearViewedResponses(room.code);
  };

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar room={room} />
      <div className="w-full overflow-hidden p-2">
        <div className="flex h-6 items-center">
          <SidebarTrigger />
          {showingParticipantResponse && !isHistoricalRoom && (
            <>
              <Separator orientation="vertical" className="mx-2 h-[2px]" />
              <Button
                onClick={handleBackToQuestion}
                variant="link"
                className="cursor-pointer px-2"
              >
                Back to Question
              </Button>
            </>
          )}
        </div>
        {showingParticipantResponse ? (
          <ParticipantResponse room={room} />
        ) : (
          <DailyQuestion room={room} />
        )}
      </div>
    </SidebarProvider>
  );
};

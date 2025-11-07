"use client";

import { X, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@workspace/ui/components/sidebar";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { useRemoveParticipant } from "@/features/daily/api/use-remove-participant";
import { useDailyQuestionState } from "@/features/daily/hooks/use-daily-question-state";
import { useDailyQuestion } from "@/features/daily/providers/daily-question-provider";
import { formatRoomCreationDate } from "@/lib/utils";

export const AppSidebar = ({ room }) => {
  const { mutate: removeParticipant } = useRemoveParticipant();
  const { currentQuestion } = useDailyQuestion();
  const [hoveredParticipantId, setHoveredParticipantId] = useState(null);
  const { isCurrentParticipant, hasHydrated, setViewingParticipantId } =
    useDailyQuestionState();

  const roomQuestion = room?.participants?.find((p) => p.response?.question)
    ?.response?.question;

  const isHistoricalRoom =
    roomQuestion && currentQuestion && roomQuestion.id !== currentQuestion.id;

  const handleRemoveParticipant = (participantId) => {
    if (isHistoricalRoom) return;
    removeParticipant({ id: participantId, roomCode: room.code });
  };

  const handleParticipantClick = (participant) => {
    if (!participant.response?.text) return;

    setViewingParticipantId(participant.id);
  };

  const handleInviteTeam = async () => {
    const roomUrl = `${window.location.origin}/room/${room.code}`;

    try {
      await navigator.clipboard.writeText(roomUrl);
      toast.success("Room link copied to clipboard!", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Failed to copy link to clipboard");
    }
  };

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Participants
            {isHistoricalRoom && (
              <span className="ml-2 text-xs font-normal text-gray-500">
                ({formatRoomCreationDate(room.createdAt)})
              </span>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {!hasHydrated ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 flex-1" />
                ))}
              </div>
            ) : (
              <SidebarMenu>
                {room.participants.map((participant) => {
                  const isCurrentUser = isCurrentParticipant(
                    participant.id,
                    room.code,
                  );

                  return (
                    <SidebarMenuItem key={participant.id} className="h-full">
                      <SidebarMenuButton
                        className={cn(
                          "min-h-12 group-data-[collapsible=icon]:min-h-8 group-data-[collapsible=icon]:justify-center",
                          participant.response &&
                            "cursor-pointer hover:bg-gray-100",
                        )}
                        tooltip={participant.name}
                        onMouseEnter={() =>
                          setHoveredParticipantId(participant.id)
                        }
                        onMouseLeave={() => setHoveredParticipantId(null)}
                        onClick={() => handleParticipantClick(participant)}
                      >
                        <div className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0">
                          <div
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6",
                              participant.response
                                ? [
                                    "text-white",
                                    isCurrentUser && !isHistoricalRoom
                                      ? "bg-green-500"
                                      : "bg-blue-500",
                                  ]
                                : [
                                    "border bg-white text-gray-600",
                                    isCurrentUser && !isHistoricalRoom
                                      ? "border-green-500"
                                      : "border-blue-500",
                                  ],
                            )}
                          >
                            {participant.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold group-data-[collapsible=icon]:hidden">
                            {participant.name}
                            {isCurrentUser && !isHistoricalRoom && (
                              <span className="ml-2 text-xs font-normal text-green-600">
                                (You)
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="ml-auto flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                          {isCurrentUser && !isHistoricalRoom && (
                            <div
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveParticipant(participant.id);
                              }}
                            >
                              <X
                                className={`h-4 w-4 ${
                                  hoveredParticipantId === participant.id
                                    ? "block"
                                    : "hidden"
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
                {room.participants.length === 1 && !isHistoricalRoom && (
                  <SidebarMenuItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleInviteTeam}
                      className="mt-2 w-full group-data-[collapsible=icon]:hidden"
                    >
                      <Users className="mr-1 h-4 w-4" />
                      Invite Team
                    </Button>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

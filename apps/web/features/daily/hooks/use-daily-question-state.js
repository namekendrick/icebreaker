import { create } from "zustand";
import { persist } from "zustand/middleware";

const dailyQuestion = (set, get) => ({
  dayIndex: null,
  currentQuestion: null,
  questionStateReady: false,
  participantsByRoom: {},
  viewingParticipantId: null,
  viewedParticipantIds: {},
  hasHydrated: false,

  setDayIndex: (dayIndex) => set({ dayIndex }),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setQuestionStateReady: (ready) => set({ questionStateReady: ready }),

  setCurrentParticipant: (participantId, roomCode) => {
    set((state) => ({
      participantsByRoom: {
        ...state.participantsByRoom,
        [roomCode]: participantId,
      },
    }));
  },

  getCurrentParticipantId: (roomCode) => {
    const state = get();
    return state.participantsByRoom[roomCode] || null;
  },

  isCurrentParticipant: (participantId, roomCode) => {
    const state = get();
    return state.participantsByRoom[roomCode] === participantId;
  },

  isParticipantInRoom: (roomCode) => {
    const state = get();
    return state.participantsByRoom[roomCode] !== undefined;
  },

  clearParticipantData: (roomCode = null) => {
    if (roomCode) {
      set((state) => {
        const newParticipantsByRoom = { ...state.participantsByRoom };
        delete newParticipantsByRoom[roomCode];
        return { participantsByRoom: newParticipantsByRoom };
      });
    } else {
      set({
        participantsByRoom: {},
      });
    }
  },

  setViewingParticipantId: (participantId) => {
    set({ viewingParticipantId: participantId });
  },

  clearViewingParticipant: () => {
    set({ viewingParticipantId: null });
  },

  isViewingParticipantResponse: () => {
    const state = get();
    return state.viewingParticipantId !== null;
  },

  getViewedParticipantIds: (roomCode) => {
    const state = get();
    return state.viewedParticipantIds[roomCode] || [];
  },

  markParticipantAsViewed: (participantId, roomCode) => {
    const state = get();
    const currentViewedIds = state.viewedParticipantIds[roomCode] || [];

    if (!currentViewedIds.includes(participantId)) {
      set({
        viewedParticipantIds: {
          ...state.viewedParticipantIds,
          [roomCode]: [...currentViewedIds, participantId],
        },
      });
    }
  },

  clearViewedResponses: (roomCode) => {
    const state = get();
    set({
      viewedParticipantIds: {
        ...state.viewedParticipantIds,
        [roomCode]: [],
      },
    });
  },

  getParticipantsWithResponses: (participants) => {
    if (!participants) return [];
    return participants.filter((participant) => participant.response?.text);
  },

  getNextRandomParticipant: (
    participants,
    roomCode,
    excludeParticipantId = null,
  ) => {
    const state = get();
    if (!participants || !state.hasHydrated) return null;

    const participantsWithResponses = participants.filter(
      (participant) => participant.response?.text,
    );

    if (participantsWithResponses.length === 0) return null;

    const viewedIds = state.viewedParticipantIds[roomCode] || [];

    if (participantsWithResponses.length === viewedIds.length) {
      set({
        viewedParticipantIds: {
          ...state.viewedParticipantIds,
          [roomCode]: [],
        },
      });

      const availableParticipants = excludeParticipantId
        ? participantsWithResponses.filter((p) => p.id !== excludeParticipantId)
        : participantsWithResponses;

      if (availableParticipants.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * availableParticipants.length,
        );
        return availableParticipants[randomIndex];
      }

      const randomIndex = Math.floor(
        Math.random() * participantsWithResponses.length,
      );
      return participantsWithResponses[randomIndex];
    }

    const unviewedParticipants = participantsWithResponses.filter(
      (participant) => !viewedIds.includes(participant.id),
    );

    if (unviewedParticipants.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * unviewedParticipants.length);
    return unviewedParticipants[randomIndex];
  },

  isLastUnviewedParticipant: (participantId, participants, roomCode) => {
    const state = get();
    if (!participants || !participantId || !roomCode) return false;

    const participantsWithResponses = participants.filter(
      (participant) => participant.response?.text,
    );

    if (participantsWithResponses.length === 0) return false;

    const viewedIds = state.viewedParticipantIds[roomCode] || [];
    const unviewedParticipants = participantsWithResponses.filter(
      (participant) => !viewedIds.includes(participant.id),
    );

    // This is the last unviewed participant if there's only one unviewed participant
    // and it's the one being viewed
    return (
      unviewedParticipants.length === 1 &&
      unviewedParticipants[0].id === participantId
    );
  },

  setHasHydrated: (hasHydrated) => {
    set({ hasHydrated });
  },

  resetDailyState: (dayIndex) => {
    const state = get();

    if (state.dayIndex !== dayIndex) {
      set({
        dayIndex,
        viewedParticipantIds: {},
        participantsByRoom: {},
      });
    }
  },
});

export const useDailyQuestionState = create(
  persist(dailyQuestion, {
    name: "daily-question",
    partialize: (state) => ({
      dayIndex: state.dayIndex,
      participantsByRoom: state.participantsByRoom,
      viewedParticipantIds: state.viewedParticipantIds,
    }),
    onRehydrateStorage: () => (state) => {
      state?.setHasHydrated(true);
    },
  }),
);

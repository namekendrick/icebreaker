import { useMutation } from "@workspace/react-query";

import { useDailyQuestionState } from "@/features/daily/hooks/use-daily-question-state";
import { removeParticipant } from "@/features/daily/server/remove-participant";

export const useRemoveParticipant = () => {
  const { isCurrentParticipant, clearParticipantData } =
    useDailyQuestionState();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await removeParticipant(values);

      if (response.status !== 200 && response.status !== 201)
        throw new Error(response.message);

      return response.data;
    },
    onSuccess: (data, variables) => {
      // Clear participant data for the specific room if it's the current user
      if (
        variables.roomCode &&
        isCurrentParticipant(variables.id, variables.roomCode)
      ) {
        clearParticipantData(variables.roomCode);
      }
      window.dispatchEvent(new CustomEvent("participant-removed"));
    },
  });

  return mutation;
};

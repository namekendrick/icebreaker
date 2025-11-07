import { useMutation } from "@workspace/react-query";

import { useDailyQuestionState } from "@/features/daily/hooks/use-daily-question-state";
import { addParticipant } from "@/features/daily/server/add-participant";

export const useAddParticipant = () => {
  const { setCurrentParticipant } = useDailyQuestionState();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await addParticipant(values);

      if (response.status !== 200 && response.status !== 201)
        throw new Error(response.message);

      return response.data;
    },
    onSuccess: (data) => {
      setCurrentParticipant(data.participant.id, data.room.code);
      window.dispatchEvent(new CustomEvent("participant-added"));
    },
  });

  return mutation;
};

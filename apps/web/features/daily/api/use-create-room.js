import { useMutation } from "@workspace/react-query";
import { useRouter } from "next/navigation";

import { useDailyQuestionState } from "@/features/daily/hooks/use-daily-question-state";
import { createRoom } from "@/features/daily/server/create-room";

export const useCreateRoom = () => {
  const router = useRouter();
  const { setCurrentParticipant } = useDailyQuestionState();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await createRoom(values);

      if (response.status !== 200 && response.status !== 201)
        throw new Error(response.message);

      return response.data;
    },
    onSuccess: (data) => {
      if (data.participant)
        setCurrentParticipant(data.participant.id, data.room.code);

      router.push(`/room/${data.room.code}`);
    },
  });

  return mutation;
};

import { useQuery } from "@workspace/react-query";
import { useState, useEffect } from "react";

import { getRoom } from "@/db/room";

export const useGetRoom = (roomCode) => {
  const [isActive, setIsActive] = useState(false);

  const query = useQuery({
    queryKey: ["room", roomCode],
    queryFn: () => getRoom(roomCode),
    enabled: !!roomCode,
    refetchInterval: isActive ? 1000 : 5000,
    refetchIntervalInBackground: true,
    staleTime: 0,
  });

  useEffect(() => {
    const handleResponseActivity = () => {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 30000);
    };

    const handleParticipantActivity = () => {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 15000);
    };

    window.addEventListener("response-submitted", handleResponseActivity);
    window.addEventListener("participant-added", handleParticipantActivity);
    window.addEventListener("participant-removed", handleParticipantActivity);

    return () => {
      window.removeEventListener("response-submitted", handleResponseActivity);
      window.removeEventListener(
        "participant-added",
        handleParticipantActivity,
      );
      window.removeEventListener(
        "participant-removed",
        handleParticipantActivity,
      );
    };
  }, []);

  return query;
};

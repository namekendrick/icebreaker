import { useMutation } from "@workspace/react-query";

import { saveResponse } from "@/features/daily/server/save-response";

export const useSaveResponse = () => {
  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await saveResponse(values);

      if (response.status !== 200 && response.status !== 201)
        throw new Error(response.message);

      return response.data;
    },
    onSuccess: () => {
      window.dispatchEvent(new CustomEvent("response-submitted"));
    },
  });

  return mutation;
};

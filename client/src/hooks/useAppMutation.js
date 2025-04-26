import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAppMutation(mutationFn, options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      if (data?.message) {
        toast.success(data.message); // ✅ backend controlled message
      } else if (options.successMessage) {
        toast.success(options.successMessage);
      }

      options?.onSuccess?.(data, variables, context); // ✅ call extra custom logic if needed

      if (options.invalidateQueries) {
        queryClient.refetchQueries({
          queryKey: options.invalidateQueries,
        });
      }
    },
    onError: (error, variables, context) => {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message); // ✅ backend error message
      } else if (options.errorMessage) {
        toast.error(options.errorMessage);
      } else {
        toast.error("Something went wrong");
      }

      options?.onError?.(error, variables, context); // ✅ call extra custom error logic if needed
    },
    ...options,
  });
}

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRole, rolesQueryKeys, updateRole } from "@/lib/roles/roles";
import { useAppMutation } from "@/hooks/useAppMutation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// --- Form Validation Schema ---
const roleSchema = z.object({
  role_name: z.string().min(1, "Role Name is required"),
  role_description: z.string().optional(),
});

export default function Roles({ type = "add", editData, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      role_name: "",
      role_description: "",
    },
  });

  const createMutation = useAppMutation(createRole, {
    invalidateQueries: rolesQueryKeys.tag,
  });

  const updateMutation = useAppMutation(
    ({ id, data }) => updateRole(id, data),
    {
      invalidateQueries: rolesQueryKeys.tag,
    }
  );

  useEffect(() => {
    if (type === "edit" && editData) {
      reset({
        role_name: editData.role_name || "",
        role_description: editData.role_description || "",
      });
    }
  }, [editData, type, reset]);

  const onSubmit = (data) => {
    if (type === "edit") {
      updateMutation.mutate(
        { id: editData.role_id, data },
        {
          onSuccess: () => {
            onClose?.();
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          onClose?.();
        },
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-4 p-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Role Name</label>
        <Input {...register("role_name")} placeholder="Enter role name" />
        {errors.role_name && (
          <p className="text-red-500 text-xs mt-1">
            {errors.role_name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Role Description
        </label>
        <Textarea
          {...register("role_description")}
          placeholder="Enter description (optional)"
        />
        {errors.role_description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.role_description.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? type === "edit"
            ? "Updating..."
            : "Saving..."
          : type === "edit"
            ? "Update Role"
            : "Save Role"}
      </Button>
    </form>
  );
}

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createDepartment,
  updateDepartment,
  departmentsQueryKeys,
} from "@/lib/common/departments"; // make sure this path matches your file structure
import { useAppMutation } from "@/hooks/useAppMutation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// --- Form Validation Schema ---
const departmentSchema = z.object({
  department_name: z.string().min(1, "Department Name is required"),
  department_description: z.string().optional(),
});

export default function Departments({ type = "add", editData, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      department_name: "",
      department_description: "",
    },
  });

  const createMutation = useAppMutation(createDepartment, {
    invalidateQueries: [departmentsQueryKeys.tag],
  });

  const updateMutation = useAppMutation(
    ({ id, data }) => updateDepartment(id, data),
    {
      invalidateQueries: [departmentsQueryKeys.tag],
    }
  );

  useEffect(() => {
    if (type === "edit" && editData) {
      reset({
        department_name: editData.department_name || "",
        department_description: editData.department_description || "",
      });
    }
  }, [editData, type, reset]);

  const onSubmit = (data) => {
    if (type === "edit") {
      updateMutation.mutate(
        { id: editData.department_id, data },
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
        <label className="block text-sm font-medium mb-1">
          Department Name
        </label>
        <Input
          {...register("department_name")}
          placeholder="Enter department name"
        />
        {errors.department_name && (
          <p className="text-red-500 text-xs mt-1">
            {errors.department_name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Department Description
        </label>
        <Textarea
          {...register("department_description")}
          placeholder="Enter description (optional)"
        />
        {errors.department_description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.department_description.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? type === "edit"
            ? "Updating..."
            : "Saving..."
          : type === "edit"
            ? "Update Department"
            : "Save Department"}
      </Button>
    </form>
  );
}

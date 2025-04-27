import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUnit, updateUnit, unitsQueryKeys } from "@/lib/product/units";
import { useAppMutation } from "@/hooks/useAppMutation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const unitSchema = z.object({
  unit_name: z.string().min(1, "Unit Name is required"),
  unit_abbreviation: z.string().optional(),
  unit_symbol: z.string().optional(),
});

export default function Units({ type = "add", editData, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      unit_name: "",
      unit_abbreviation: "",
      unit_symbol: "",
    },
  });

  const createMutation = useAppMutation(createUnit, {
    invalidateQueries: [unitsQueryKeys.tag],
  });

  const updateMutation = useAppMutation(
    ({ id, data }) => updateUnit(id, data),
    {
      invalidateQueries: [unitsQueryKeys.tag],
    }
  );

  useEffect(() => {
    if (type === "edit" && editData) {
      reset({
        unit_name: editData.unit_name || "",
        unit_abbreviation: editData.unit_abbreviation || "",
        unit_symbol: editData.unit_symbol || "",
      });
    }
  }, [editData, type, reset]);

  const onSubmit = (data) => {
    if (type === "edit") {
      updateMutation.mutate(
        { id: editData.unit_id, data },
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
        <label className="block text-sm font-medium mb-1">Unit Name</label>
        <Input {...register("unit_name")} placeholder="Enter unit name" />
        {errors.unit_name && (
          <p className="text-red-500 text-xs mt-1">
            {errors.unit_name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Unit Abbreviation
        </label>
        <Input
          {...register("unit_abbreviation")}
          placeholder="Enter abbreviation (optional)"
        />
        {errors.unit_abbreviation && (
          <p className="text-red-500 text-xs mt-1">
            {errors.unit_abbreviation.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Unit Symbol</label>
        <Input
          {...register("unit_symbol")}
          placeholder="Enter symbol (optional)"
        />
        {errors.unit_symbol && (
          <p className="text-red-500 text-xs mt-1">
            {errors.unit_symbol.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? type === "edit"
            ? "Updating..."
            : "Saving..."
          : type === "edit"
            ? "Update Unit"
            : "Save Unit"}
      </Button>
    </form>
  );
}

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAttribute,
  updateAttribute,
  attributesQueryKeys,
} from "@/lib/product/attribute";
import { useAppMutation } from "@/hooks/useAppMutation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const attributeSchema = z.object({
  attribute_name: z.string().min(1, "Attribute Name is required"),
  input_type: z.enum([
    "text",
    "number",
    "select",
    "multiselect",
    "boolean",
    "color",
    "date",
  ]),
});

const inputTypes = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Select", value: "select" },
  { label: "MultiSelect", value: "multiselect" },
  { label: "Boolean", value: "boolean" },
  { label: "Color", value: "color" },
  { label: "Date", value: "date" },
];

export default function Attributes({ type = "add", editData, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(attributeSchema),
    defaultValues: {
      attribute_name: "",
      input_type: "text",
    },
  });

  const createMutation = useAppMutation(createAttribute, {
    invalidateQueries: [attributesQueryKeys.tag],
  });

  const updateMutation = useAppMutation(
    ({ id, data }) => updateAttribute(id, data),
    {
      invalidateQueries: [attributesQueryKeys.tag],
    }
  );

  useEffect(() => {
    if (type === "edit" && editData) {
      reset({
        attribute_name: editData.attribute_name || "",
        input_type: editData.input_type || "text",
      });
    }
  }, [editData, type, reset]);

  const onSubmit = (data) => {
    if (type === "edit") {
      updateMutation.mutate(
        { id: editData.attribute_id, data },
        { onSuccess: () => onClose?.() }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => onClose?.(),
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
        <label className="block text-sm font-medium mb-1">Attribute Name</label>
        <Input
          {...register("attribute_name")}
          placeholder="Enter attribute name"
        />
        {errors.attribute_name && (
          <p className="text-red-500 text-xs mt-1">
            {errors.attribute_name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Input Type</label>
        <Controller
          name="input_type"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select input type" />
              </SelectTrigger>
              <SelectContent>
                {inputTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.input_type && (
          <p className="text-red-500 text-xs mt-1">
            {errors.input_type.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? type === "edit"
            ? "Updating..."
            : "Saving..."
          : type === "edit"
            ? "Update Attribute"
            : "Save Attribute"}
      </Button>
    </form>
  );
}

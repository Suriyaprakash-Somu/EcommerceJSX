import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  createAttributeValue,
  updateAttributeValue,
  attributeValuesQueryKeys,
} from "@/lib/product/attributeValues";
import { fetchAllUnits, unitsQueryKeys } from "@/lib/product/units";
import {
  fetchAllAttributes,
  attributesQueryKeys,
} from "@/lib/product/attribute";
import { useAppMutation } from "@/hooks/useAppMutation";
import { useAppQuery } from "@/hooks/useAppQuery";

const attributeValueSchema = z.object({
  attribute_id: z.string().min(1, "Attribute is required"),
  value_text: z.string().min(1, "Value Text is required"),
  unit_id: z.string().optional().nullable(),
});

export default function AttributeValues({ type = "add", editData, onClose }) {
  const defaultValues = useMemo(
    () => ({
      attribute_id: editData?.attribute_id ? String(editData.attribute_id) : "",
      value_text: editData?.value_text ?? "",
      unit_id: editData?.unit_id ? String(editData.unit_id) : null,
    }),
    [editData]
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(attributeValueSchema),
    defaultValues,
  });

  const createMutation = useAppMutation(createAttributeValue, {
    invalidateQueries: [attributeValuesQueryKeys.tag],
  });

  const updateMutation = useAppMutation(
    ({ id, data }) => updateAttributeValue(id, data),
    {
      invalidateQueries: [attributeValuesQueryKeys.tag],
    }
  );

  const { data: unitsData = [] } = useAppQuery(
    unitsQueryKeys.all,
    fetchAllUnits
  );
  const { data: attributesData = [] } = useAppQuery(
    attributesQueryKeys.all,
    fetchAllAttributes
  );

  const onSubmit = (data) => {
    const payload = {
      attribute_id: Number(data.attribute_id),
      value_text: data.value_text,
      unit_id: data.unit_id ? Number(data.unit_id) : null,
    };

    if (type === "edit" && editData) {
      updateMutation.mutate(
        { id: editData.value_id, data: payload },
        { onSuccess: () => onClose?.() }
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => onClose?.() });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (!attributesData.length) {
    return (
      <div className="text-center text-gray-500 p-4">Loading attributes…</div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-4 p-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Attribute</label>
        <Controller
          name="attribute_id"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select attribute" />
              </SelectTrigger>
              <SelectContent>
                {attributesData.map((attribute) => (
                  <SelectItem
                    key={attribute.attribute_id}
                    value={String(attribute.attribute_id)}
                  >
                    {attribute.attribute_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.attribute_id && (
          <p className="text-red-500 text-xs mt-1">
            {errors.attribute_id.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Value Text</label>
        <Input {...register("value_text")} placeholder="Enter value" />
        {errors.value_text && (
          <p className="text-red-500 text-xs mt-1">
            {errors.value_text.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Unit (optional)
        </label>
        <Controller
          name="unit_id"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ?? "null"}
              onValueChange={(value) =>
                field.onChange(value === "null" ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">None</SelectItem>
                {unitsData.map((unit) => (
                  <SelectItem key={unit.unit_id} value={String(unit.unit_id)}>
                    {unit.unit_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.unit_id && (
          <p className="text-red-500 text-xs mt-1">{errors.unit_id.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? type === "edit"
            ? "Updating…"
            : "Saving…"
          : type === "edit"
            ? "Update Attribute Value"
            : "Save Attribute Value"}
      </Button>
    </form>
  );
}

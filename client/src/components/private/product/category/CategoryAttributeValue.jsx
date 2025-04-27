import React, { useMemo, useRef, useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
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
  createCategoryAttributeValue,
  updateCategoryAttributeValue,
  categoryAttributeValuesQueryKeys,
} from "@/lib/product/categoryAttributeValues";
import {
  fetchAllCategories,
  categoriesQueryKeys,
} from "@/lib/product/category";
import {
  fetchAllAttributes,
  attributesQueryKeys,
} from "@/lib/product/attribute";
import {
  fetchAllAttributeValues,
  attributeValuesQueryKeys,
} from "@/lib/product/attributeValues";

import { useAppMutation } from "@/hooks/useAppMutation";
import { useAppQuery } from "@/hooks/useAppQuery";

const schema = z.object({
  category_id: z.string().min(1, "Category is required"),
  attribute_id: z.string().min(1, "Attribute is required"),
  value_id: z.string().min(1, "Value is required"),
});

export default function CategoryAttributeValueForm({
  type = "add",
  editData,
  onClose,
}) {
  const defaultValues = useMemo(
    () => ({
      category_id: editData?.category_id ? String(editData.category_id) : "",
      attribute_id: editData?.attribute_id ? String(editData.attribute_id) : "",
      value_id: editData?.value_id ? String(editData.value_id) : "",
    }),
    [editData]
  );

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const createMutation = useAppMutation(createCategoryAttributeValue, {
    invalidateQueries: [categoryAttributeValuesQueryKeys.tag],
  });

  const updateMutation = useAppMutation(
    ({ id, data }) => updateCategoryAttributeValue(id, data),
    {
      invalidateQueries: [categoryAttributeValuesQueryKeys.tag],
    }
  );

  const { data: categoriesData = [] } = useAppQuery(
    categoriesQueryKeys.all,
    fetchAllCategories
  );
  const { data: attributesData = [] } = useAppQuery(
    attributesQueryKeys.all,
    fetchAllAttributes
  );
  const { data: attributeValuesData = [] } = useAppQuery(
    attributeValuesQueryKeys.all,
    fetchAllAttributeValues
  );

  const selectedAttributeId = useWatch({ control, name: "attribute_id" });
  const initialAttributeIdRef = useRef(
    editData ? String(editData.attribute_id) : ""
  );

  useEffect(() => {
    if (
      selectedAttributeId &&
      selectedAttributeId !== initialAttributeIdRef.current
    ) {
      setValue("value_id", "");
    }
  }, [selectedAttributeId, setValue]);

  const attributeIdForFiltering =
    selectedAttributeId || initialAttributeIdRef.current;

  const filteredAttributeValues = attributeValuesData.filter(
    (v) => String(v.attribute_id) === attributeIdForFiltering
  );

  const onSubmit = (data) => {
    const payload = {
      category_id: Number(data.category_id),
      attribute_id: Number(data.attribute_id),
      value_id: Number(data.value_id),
    };

    if (type === "edit" && editData) {
      updateMutation.mutate(
        { id: editData.id, data: payload },
        { onSuccess: () => onClose?.() }
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => onClose?.() });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-4 p-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesData.map((c) => (
                  <SelectItem key={c.category_id} value={String(c.category_id)}>
                    {c.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category_id && (
          <p className="text-red-500 text-xs mt-1">
            {errors.category_id.message}
          </p>
        )}
      </div>

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
                {attributesData.map((a) => (
                  <SelectItem
                    key={a.attribute_id}
                    value={String(a.attribute_id)}
                  >
                    {a.attribute_name}
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
        <label className="block text-sm font-medium mb-1">Value</label>
        <Controller
          name="value_id"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={!attributeIdForFiltering}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select value" />
              </SelectTrigger>
              <SelectContent>
                {filteredAttributeValues.length ? (
                  filteredAttributeValues.map((v) => (
                    <SelectItem key={v.value_id} value={String(v.value_id)}>
                      {v.value_text}
                    </SelectItem>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm p-2">
                    No values available
                  </div>
                )}
              </SelectContent>
            </Select>
          )}
        />
        {errors.value_id && (
          <p className="text-red-500 text-xs mt-1">{errors.value_id.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? type === "edit"
            ? "Updating..."
            : "Saving..."
          : type === "edit"
            ? "Update Mapping"
            : "Save Mapping"}
      </Button>
    </form>
  );
}

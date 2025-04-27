"use client";

import { useEffect } from "react";
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
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      category_id: "",
      attribute_id: "",
      value_id: "",
    },
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

  useEffect(() => {
    if (type === "edit" && editData) {
      reset({
        category_id: editData.category_id ? String(editData.category_id) : "",
        attribute_id: editData.attribute_id
          ? String(editData.attribute_id)
          : "",
        value_id: editData.value_id ? String(editData.value_id) : "",
      });
    }
  }, [editData, type, reset]);

  const onSubmit = (data) => {
    const payload = {
      category_id: parseInt(data.category_id),
      attribute_id: parseInt(data.attribute_id),
      value_id: parseInt(data.value_id),
    };

    if (type === "edit") {
      updateMutation.mutate(
        { id: editData.mapping_id, data: payload },
        { onSuccess: () => onClose?.() }
      );
    } else {
      createMutation.mutate(payload, {
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
                {categoriesData.map((cat) => (
                  <SelectItem
                    key={cat.category_id}
                    value={String(cat.category_id)}
                  >
                    {cat.category_name}
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
                {attributesData.map((attr) => (
                  <SelectItem
                    key={attr.attribute_id}
                    value={String(attr.attribute_id)}
                  >
                    {attr.attribute_name}
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
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select value" />
              </SelectTrigger>
              <SelectContent>
                {attributeValuesData.map((val) => (
                  <SelectItem key={val.value_id} value={String(val.value_id)}>
                    {val.value_text}
                  </SelectItem>
                ))}
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

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useAppMutation } from "@/hooks/useAppMutation";
import { categoriesQueryKeys } from "@/lib/product/category";

const categorySchema = z.object({
  category_name: z.string().min(2, "Category name is required"),
  category_description: z.string().optional(),
  category_image: z.string().url("Must be a valid URL").optional(),
  category_url: z.string().url("Must be a valid URL").optional(),
});

export default function Category({
  createNode,
  updateNode,
  editData = null,
  parentId = null,
  onClose,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      category_name: "",
      category_description: "",
      category_image: "",
      category_url: "",
    },
  });

  const createMutation = useAppMutation(createNode, {
    invalidateQueries: categoriesQueryKeys.tag,
  });

  const updateMutation = useAppMutation(
    ({ id, data }) => updateNode(id, data),
    {
      invalidateQueries: categoriesQueryKeys.tag,
    }
  );

  useEffect(() => {
    if (editData) {
      reset({
        category_name: editData.category_name || "",
        category_description: editData.category_description || "",
        category_image: editData.category_image || "",
        category_url: editData.category_url || "",
      });
    }
  }, [editData, reset]);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      parent_id: editData ? (editData.parent_id ?? null) : parentId,
    };

    if (editData) {
      updateMutation.mutate(
        { id: editData.category_id, data: payload },
        {
          onSuccess: () => {
            onClose?.();
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
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
      className="max-w-md space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Category Name</label>
        <Input
          {...register("category_name")}
          placeholder="Enter category name"
        />
        {errors.category_name && (
          <p className="text-red-500 text-xs mt-1">
            {errors.category_name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          {...register("category_description")}
          placeholder="Enter description (optional)"
        />
        {errors.category_description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.category_description.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <Input
          {...register("category_image")}
          placeholder="Enter image URL (optional)"
        />
        {errors.category_image && (
          <p className="text-red-500 text-xs mt-1">
            {errors.category_image.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category URL</label>
        <Input
          {...register("category_url")}
          placeholder="Enter category URL (optional)"
        />
        {errors.category_url && (
          <p className="text-red-500 text-xs mt-1">
            {errors.category_url.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? editData
            ? "Updating..."
            : "Saving..."
          : editData
            ? "Update Category"
            : "Save Category"}
      </Button>
    </form>
  );
}

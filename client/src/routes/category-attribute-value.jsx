import ManageCategoryAttributeValues from "@/components/private/product/category/ManageCategoryAttributeValues";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/category-attribute-value")({
  component: ManageCategoryAttributeValues,
});

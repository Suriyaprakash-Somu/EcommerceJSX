import ManageCategory from "@/components/private/product/category/ManageCategory";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/category")({
  component: ManageCategory,
});

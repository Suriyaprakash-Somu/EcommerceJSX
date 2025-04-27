import ManageAttributeValues from "@/components/private/product/attributes/ManageAttributeValues";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/attribute-values")({
  component: ManageAttributeValues,
});

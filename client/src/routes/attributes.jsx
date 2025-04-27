import ManageAttributes from "@/components/private/product/attributes/ManageAttributes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/attributes")({
  component: ManageAttributes,
});

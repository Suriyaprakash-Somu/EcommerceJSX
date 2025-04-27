import ManageUnits from "@/components/private/product/units/ManageUnits";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/units")({
  component: ManageUnits,
});

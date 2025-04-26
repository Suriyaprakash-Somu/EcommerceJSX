import { createFileRoute } from "@tanstack/react-router";
import ManageRoles from "@/components/private/roles/ManageRoles";

export const Route = createFileRoute("/roles")({
  component: ManageRoles,
});

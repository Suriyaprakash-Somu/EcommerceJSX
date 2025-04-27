import { createFileRoute } from "@tanstack/react-router";
import ManageDepartments from "@/components/private/common/departments/ManageDepartments";

export const Route = createFileRoute("/departments")({
  component: ManageDepartments,
});

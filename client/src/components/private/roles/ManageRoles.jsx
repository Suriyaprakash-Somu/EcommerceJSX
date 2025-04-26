import React, { useState } from "react";
import {
  rolesQueryKeys,
  fetchPaginatedRoles,
  deleteRole,
} from "@/lib/roles/roles";
import DataTable from "@/components/ui/table/DataTable";
import RoleForm from "@/components/private/roles/Roles";

const ManageRoles = () => {
  const [columns, setColumns] = useState([
    { value: "role_id", label: "Role ID", visible: true },
    { value: "role_name", label: "Role Name", visible: true },
  ]);

  const columnsConfig = [
    {
      header: "Role Information",
      columns: [
        {
          accessorKey: "role_id",
          header: "Role ID",
        },
        {
          accessorKey: "role_name",
          header: "Role Name",
        },
      ],
    },
  ];

  return (
    <>
      <DataTable
        tag={rolesQueryKeys.tag}
        fetchData={(props) => fetchPaginatedRoles(props)}
        columnsConfig={columnsConfig}
        columns={columns}
        setColumns={setColumns}
        onDelete={deleteRole}
        title="Roles"
        EditComponent={RoleForm}
        AddComponent={RoleForm}
        addButtonText={"Add Role"}
      />
    </>
  );
};

export default ManageRoles;

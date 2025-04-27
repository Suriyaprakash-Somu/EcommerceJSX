import React, { useState } from "react";
import {
  departmentsQueryKeys,
  fetchPaginatedDepartments,
  deleteDepartment,
} from "@/lib/common/departments"; // Update your import path if needed
import DataTable from "@/components/ui/table/DataTable";
import DepartmentForm from "@/components/private/common/departments/Departments"; // Point to your department form component

const ManageDepartments = () => {
  const [columns, setColumns] = useState([
    { value: "department_id", label: "Department ID", visible: true },
    { value: "department_name", label: "Department Name", visible: true },
  ]);

  const columnsConfig = [
    {
      header: "Department Information",
      columns: [
        {
          accessorKey: "department_id",
          header: "Department ID",
        },
        {
          accessorKey: "department_name",
          header: "Department Name",
        },
      ],
    },
  ];

  return (
    <>
      <DataTable
        tag={departmentsQueryKeys.tag}
        fetchData={(props) => fetchPaginatedDepartments(props)}
        columnsConfig={columnsConfig}
        columns={columns}
        setColumns={setColumns}
        onDelete={deleteDepartment}
        title="Departments"
        EditComponent={DepartmentForm}
        AddComponent={DepartmentForm}
        addButtonText={"Add Department"}
      />
    </>
  );
};

export default ManageDepartments;

import React, { useState } from "react";
import {
  unitsQueryKeys,
  fetchPaginatedUnits,
  deleteUnit,
} from "@/lib/product/units";
import DataTable from "@/components/ui/table/DataTable";
import UnitForm from "@/components/private/product/units/Units";

const ManageUnits = () => {
  const [columns, setColumns] = useState([
    { value: "unit_id", label: "Unit ID", visible: true },
    { value: "unit_name", label: "Unit Name", visible: true },
    { value: "unit_abbreviation", label: "Abbreviation", visible: true },
    { value: "unit_symbol", label: "Symbol", visible: true },
  ]);

  const columnsConfig = [
    {
      header: "Unit Information",
      columns: [
        {
          accessorKey: "unit_id",
          header: "Unit ID",
        },
        {
          accessorKey: "unit_name",
          header: "Unit Name",
        },
        {
          accessorKey: "unit_abbreviation",
          header: "Abbreviation",
        },
        {
          accessorKey: "unit_symbol",
          header: "Symbol",
        },
      ],
    },
  ];

  return (
    <>
      <DataTable
        tag={unitsQueryKeys.tag}
        fetchData={(props) => fetchPaginatedUnits(props)}
        columnsConfig={columnsConfig}
        columns={columns}
        setColumns={setColumns}
        onDelete={deleteUnit}
        title="Units"
        EditComponent={UnitForm}
        AddComponent={UnitForm}
        addButtonText={"Add Unit"}
      />
    </>
  );
};

export default ManageUnits;

"use client";

import React, { useState } from "react";
import { attributeValuesQueryKeys, fetchPaginatedAttributeValues, deleteAttributeValue } from "@/lib/product/attributeValues";
import DataTable from "@/components/ui/table/DataTable";
import AttributeValuesForm from "@/components/private/product/attributes/AttributeValues";

const ManageAttributeValues = () => {
  const [columns, setColumns] = useState([
    { value: "value_id", label: "Value ID", visible: true },
    { value: "value_text", label: "Value Text", visible: true },
  ]);

  const columnsConfig = [
    {
      header: "Attribute Value Information",
      columns: [
        {
          accessorKey: "value_id",
          header: "Value ID",
        },
        {
          accessorKey: "value_text",
          header: "Value Text",
        },
      ],
    },
  ];

  return (
    <DataTable
      tag={attributeValuesQueryKeys.tag}
      fetchData={(props) => fetchPaginatedAttributeValues(props)}
      columnsConfig={columnsConfig}
      columns={columns}
      setColumns={setColumns}
      onDelete={deleteAttributeValue}
      title="Attribute Values"
      EditComponent={AttributeValuesForm}
      AddComponent={AttributeValuesForm}
      addButtonText={"Add Attribute Value"}
    />
  );
};

export default ManageAttributeValues;

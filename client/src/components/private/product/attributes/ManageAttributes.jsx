import React, { useState } from "react";
import {
  attributesQueryKeys,
  fetchPaginatedAttributes,
  deleteAttribute,
} from "@/lib/product/attribute";
import DataTable from "@/components/ui/table/DataTable";
import AttributeForm from "@/components/private/product/attributes/Attributes";

const ManageAttributes = () => {
  const [columns, setColumns] = useState([
    { value: "attribute_id", label: "Attribute ID", visible: true },
    { value: "attribute_name", label: "Attribute Name", visible: true },
    { value: "input_type", label: "Input Type", visible: true },
  ]);

  const columnsConfig = [
    {
      header: "Attribute Information",
      columns: [
        {
          accessorKey: "attribute_id",
          header: "Attribute ID",
        },
        {
          accessorKey: "attribute_name",
          header: "Attribute Name",
        },
        {
          accessorKey: "input_type",
          header: "Input Type",
        },
      ],
    },
  ];

  return (
    <DataTable
      tag={attributesQueryKeys.tag}
      fetchData={(props) => fetchPaginatedAttributes(props)}
      columnsConfig={columnsConfig}
      columns={columns}
      setColumns={setColumns}
      onDelete={deleteAttribute}
      title="Attributes"
      EditComponent={AttributeForm}
      AddComponent={AttributeForm}
      addButtonText={"Add Attribute"}
    />
  );
};

export default ManageAttributes;

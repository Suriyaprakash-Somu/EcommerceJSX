"use client";

import { useState } from "react";
import DataTable from "@/components/ui/table/DataTable";
import {
  categoryAttributeValuesQueryKeys,
  fetchPaginatedCategoryAttributeValues,
  deleteCategoryAttributeValue,
} from "@/lib/product/categoryAttributeValues";
import CategoryAttributeValueForm from "@/components/private/product/category/CategoryAttributeValue";

const ManageCategoryAttributeValues = () => {
  const [columns, setColumns] = useState([
    { value: "mapping_id", label: "ID", visible: true },
    { value: "category_name", label: "Category", visible: true },
    { value: "attribute_name", label: "Attribute", visible: true },
    { value: "value_text", label: "Value", visible: true },
  ]);

  const columnsConfig = [
    {
      header: "Mapping Information",
      columns: [
        { accessorKey: "mapping_id", header: "ID" },
        { accessorKey: "category_name", header: "Category" },
        { accessorKey: "attribute_name", header: "Attribute" },
        { accessorKey: "value_text", header: "Value" },
      ],
    },
  ];

  return (
    <DataTable
      tag={categoryAttributeValuesQueryKeys.tag}
      fetchData={(props) => fetchPaginatedCategoryAttributeValues(props)}
      columnsConfig={columnsConfig}
      columns={columns}
      setColumns={setColumns}
      onDelete={deleteCategoryAttributeValue}
      title="Category Attribute Values"
      EditComponent={CategoryAttributeValueForm}
      AddComponent={CategoryAttributeValueForm}
      addButtonText="Add Mapping"
    />
  );
};

export default ManageCategoryAttributeValues;

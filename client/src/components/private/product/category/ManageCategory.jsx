import TreeManager from "@/components/ui/tree/TreeManager";
import CategoryForm from "./Category"; 
import {
  fetchCategoriesTree,
  createCategory,
  updateCategory,
  deleteCategory,
  categoriesQueryKeys,
} from "@/lib/product/category";

const ManageCategory = () => {
  return (
    <TreeManager
      title="Manage Categories"
      fetchTree={fetchCategoriesTree}
      createNode={createCategory}
      updateNode={updateCategory}
      deleteNode={deleteCategory}
      FormComponent={CategoryForm}
      idKey="category_id"
      nameKey="category_name"
      parentIdKey="parent_id"
      tag={categoriesQueryKeys.tree}
    />
  );
};

export default ManageCategory;

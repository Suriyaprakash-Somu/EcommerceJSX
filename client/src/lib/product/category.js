import { api } from "@/lib/axios";

export const categoriesQueryKeys = {
  tag: ["categories"],
  all: ["categories", "all"],
  paginated: (params) => ["categories", "paginated", params],
  detail: (categoryId) => ["categories", "detail", categoryId],
  tree: ["categories", "tree"],
};

export async function fetchAllCategories() {
  const { data } = await api.get("/categories/all");
  return data;
}

export async function fetchPaginatedCategories({
  pageIndex = 0,
  pageSize = 10,
  sorting = [],
  filters = {},
}) {
  const { data } = await api.get("/categories/paginated", {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      sorting: JSON.stringify(sorting),
      filters: JSON.stringify(filters),
    },
  });
  return data;
}

export async function fetchCategoriesTree() {
  const { data } = await api.get("/categories/tree");
  return data;
}

export async function fetchCategoryById(categoryId) {
  const { data } = await api.get(`/categories/${categoryId}`);
  return data;
}

export async function createCategory(categoryData) {
  const { data } = await api.post("/categories", categoryData);
  return data;
}

export async function updateCategory(categoryId, categoryData) {
  const { data } = await api.put(`/categories/${categoryId}`, categoryData);
  return data;
}

export async function deleteCategory(categoryId) {
  const { data } = await api.delete(`/categories/${categoryId}`);
  return data;
}

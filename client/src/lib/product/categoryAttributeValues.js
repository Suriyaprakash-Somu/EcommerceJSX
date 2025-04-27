import { api } from "@/lib/axios";

export const categoryAttributeValuesQueryKeys = {
  tag: ["categoryAttributeValues"],
  all: ["categoryAttributeValues", "all"],
  paginated: (params) => ["categoryAttributeValues", "paginated", params],
  detail: (mappingId) => ["categoryAttributeValues", "detail", mappingId],
};

export async function fetchAllCategoryAttributeValues() {
  const { data } = await api.get("/category-attribute-values/all");
  return data;
}

export async function fetchPaginatedCategoryAttributeValues({
  pageIndex = 0,
  pageSize = 10,
  sorting = [],
  filters = {},
}) {
  const { data } = await api.get("/category-attribute-values/paginated", {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      sorting: JSON.stringify(sorting),
      filters: JSON.stringify(filters),
    },
  });
  return data;
}

export async function fetchCategoryAttributeValueById(mappingId) {
  const { data } = await api.get(`/category-attribute-values/${mappingId}`);
  return data;
}

export async function createCategoryAttributeValue(mappingData) {
  const { data } = await api.post("/category-attribute-values", mappingData);
  return data;
}

export async function updateCategoryAttributeValue(mappingId, mappingData) {
  const { data } = await api.put(
    `/category-attribute-values/${mappingId}`,
    mappingData
  );
  return data;
}

export async function deleteCategoryAttributeValue(mappingId) {
  const { data } = await api.delete(`/category-attribute-values/${mappingId}`);
  return data;
}

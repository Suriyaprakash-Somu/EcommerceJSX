import { api } from "@/lib/axios";

export const attributeValuesQueryKeys = {
  tag: ["attributeValues"],
  all: ["attributeValues", "all"],
  paginated: (params) => ["attributeValues", "paginated", params],
  detail: (valueId) => ["attributeValues", "detail", valueId],
};

export async function fetchAllAttributeValues() {
  const { data } = await api.get("/attribute-values/all");
  return data;
}

export async function fetchPaginatedAttributeValues({
  pageIndex = 0,
  pageSize = 10,
  sorting = [],
  filters = {},
}) {
  const { data } = await api.get("/attribute-values/paginated", {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      sorting: JSON.stringify(sorting),
      filters: JSON.stringify(filters),
    },
  });
  return data;
}

export async function fetchAttributeValueById(valueId) {
  const { data } = await api.get(`/attribute-values/${valueId}`);
  return data;
}

export async function createAttributeValue(attributeValueData) {
  const { data } = await api.post("/attribute-values", attributeValueData);
  return data;
}

export async function updateAttributeValue(valueId, attributeValueData) {
  const { data } = await api.put(
    `/attribute-values/${valueId}`,
    attributeValueData
  );
  return data;
}

export async function deleteAttributeValue(valueId) {
  const { data } = await api.delete(`/attribute-values/${valueId}`);
  return data;
}

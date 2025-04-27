import { api } from "@/lib/axios";

export const attributesQueryKeys = {
  tag: ["attributes"],
  all: ["attributes", "all"],
  paginated: (params) => ["attributes", "paginated", params],
  detail: (attributeId) => ["attributes", "detail", attributeId],
};

export async function fetchAllAttributes() {
  const { data } = await api.get("/attributes/all");
  return data;
}

export async function fetchPaginatedAttributes({
  pageIndex = 0,
  pageSize = 10,
  sorting = [],
  filters = {},
}) {
  const { data } = await api.get("/attributes/paginated", {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      sorting: JSON.stringify(sorting),
      filters: JSON.stringify(filters),
    },
  });
  return data;
}

export async function fetchAttributeById(attributeId) {
  const { data } = await api.get(`/attributes/${attributeId}`);
  return data;
}

export async function createAttribute(attributeData) {
  const { data } = await api.post("/attributes", attributeData);
  return data;
}

export async function updateAttribute(attributeId, attributeData) {
  const { data } = await api.put(`/attributes/${attributeId}`, attributeData);
  return data;
}

export async function deleteAttribute(attributeId) {
  const { data } = await api.delete(`/attributes/${attributeId}`);
  return data;
}

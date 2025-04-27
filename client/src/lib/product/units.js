import { api } from "@/lib/axios";

export const unitsQueryKeys = {
  tag: ["units"],
  all: ["units", "all"],
  paginated: (params) => ["units", "paginated", params],
  detail: (unitId) => ["units", "detail", unitId],
};

export async function fetchAllUnits() {
  const { data } = await api.get("/units/all");
  return data;
}

export async function fetchPaginatedUnits({
  pageIndex = 0,
  pageSize = 10,
  sorting = [],
  filters = {},
}) {
  const { data } = await api.get("/units/paginated", {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      sorting: JSON.stringify(sorting),
      filters: JSON.stringify(filters),
    },
  });
  return data;
}

export async function fetchUnitById(unitId) {
  const { data } = await api.get(`/units/${unitId}`);
  return data;
}

export async function createUnit(unitData) {
  const { data } = await api.post("/units", unitData);
  return data;
}

export async function updateUnit(unitId, unitData) {
  const { data } = await api.put(`/units/${unitId}`, unitData);
  return data;
}

export async function deleteUnit(unitId) {
  const { data } = await api.delete(`/units/${unitId}`);
  return data;
}

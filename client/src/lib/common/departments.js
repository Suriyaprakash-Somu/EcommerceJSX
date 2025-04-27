import { api } from "@/lib/axios";

export const departmentsQueryKeys = {
  tag: ["departments"],
  all: ["departments", "all"],
  paginated: (params) => ["departments", "paginated", params],
  detail: (departmentId) => ["departments", "detail", departmentId],
};

export async function fetchAllDepartments() {
  const { data } = await api.get("/departments/all");
  return data;
}

export async function fetchPaginatedDepartments({
  pageIndex = 0,
  pageSize = 10,
  sorting = [],
  filters = {},
}) {
  const { data } = await api.get("/departments/paginated", {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      sorting: JSON.stringify(sorting),
      filters: JSON.stringify(filters),
    },
  });
  return data;
}

export async function fetchDepartmentById(departmentId) {
  const { data } = await api.get(`/departments/${departmentId}`);
  return data;
}

export async function createDepartment(departmentData) {
  const { data } = await api.post("/departments", departmentData);
  return data;
}

export async function updateDepartment(departmentId, departmentData) {
  const { data } = await api.put(
    `/departments/${departmentId}`,
    departmentData
  );
  return data;
}

export async function deleteDepartment(departmentId) {
  const { data } = await api.delete(`/departments/${departmentId}`);
  return data;
}

import { api } from "@/lib/axios";

export const rolesQueryKeys = {
  tag: ["roles"],
  all: ["roles", "all"],
  paginated: (params) => ["roles", "paginated", params],
  detail: (roleId) => ["roles", "detail", roleId],
};

export async function fetchAllRoles() {
  const { data } = await api.get("/roles/all");
  return data;
}

export async function fetchPaginatedRoles({
  pageIndex = 0,
  pageSize = 10,
  sorting = [],
  filters = {},
}) {
  const { data } = await api.get("/roles/paginated", {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      sorting: JSON.stringify(sorting),
      filters: JSON.stringify(filters),
    },
  });
  return data;
}

export async function fetchRoleById(roleId) {
  const { data } = await api.get(`/roles/${roleId}`);
  return data;
}

export async function createRole(roleData) {
  const { data } = await api.post("/roles", roleData);
  return data;
}

export async function updateRole(roleId, roleData) {
  const { data } = await api.put(`/roles/${roleId}`, roleData);
  return data;
}

export async function deleteRole(roleId) {
  const { data } = await api.delete(`/roles/${roleId}`);
  return data;
}

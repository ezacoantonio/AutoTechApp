import { request } from "./http.js";

export function listCategories({ includeDeleted = false } = {}) {
  const params = new URLSearchParams();

  if (includeDeleted) {
    params.set("includeDeleted", "true");
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return request(`/api/categories${suffix}`);
}

export function createCategory(payload) {
  return request("/api/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteCategory(categoryId) {
  return request(`/api/categories/${categoryId}`, {
    method: "DELETE",
  });
}

export function restoreCategory(categoryId) {
  return request(`/api/categories/${categoryId}/restore`, {
    method: "POST",
  });
}


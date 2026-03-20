import { request } from "./http.js";

export function listNotebooks({ search = "" } = {}) {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return request(`/api/notebooks${suffix}`);
}

export function getNotebook(notebookId) {
  return request(`/api/notebooks/${notebookId}`);
}

export function createNotebook(payload) {
  return request("/api/notebooks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateNotebook(notebookId, payload) {
  return request(`/api/notebooks/${notebookId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteNotebook(notebookId) {
  return request(`/api/notebooks/${notebookId}`, {
    method: "DELETE",
  });
}

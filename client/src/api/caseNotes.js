import { request } from "./http.js";

export function listCaseNotes({ search = "" } = {}) {
  const params = new URLSearchParams();

  if (search.trim()) params.set("search", search.trim());

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return request(`/api/case-notes${suffix}`);
}

export function getCaseNote(caseNoteId) {
  return request(`/api/case-notes/${caseNoteId}`);
}

export function createCaseNote(payload) {
  return request("/api/case-notes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCaseNote(caseNoteId, payload) {
  return request(`/api/case-notes/${caseNoteId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteCaseNote(caseNoteId) {
  return request(`/api/case-notes/${caseNoteId}`, {
    method: "DELETE",
  });
}

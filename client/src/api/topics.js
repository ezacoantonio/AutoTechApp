import { request } from "./http.js";

export function listTopics({ search = "", categoryId = "" } = {}) {
  const params = new URLSearchParams();

  if (search.trim()) params.set("search", search.trim());
  if (categoryId.trim()) params.set("categoryId", categoryId.trim());

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return request(`/api/topics${suffix}`);
}

export function getTopic(topicId) {
  return request(`/api/topics/${topicId}`);
}

export function createTopic(payload) {
  return request("/api/topics", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTopic(topicId, payload) {
  return request(`/api/topics/${topicId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteTopic(topicId) {
  return request(`/api/topics/${topicId}`, {
    method: "DELETE",
  });
}

export function restoreTopic(topicId) {
  return request(`/api/topics/${topicId}/restore`, {
    method: "POST",
  });
}

import { request } from "./http.js";

export function listRecentlyDeleted() {
  return request("/api/recently-deleted");
}


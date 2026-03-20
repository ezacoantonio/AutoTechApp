import { request } from "./http.js";

export function getRoadmap() {
  return request("/api/roadmap");
}

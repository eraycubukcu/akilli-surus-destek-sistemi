import type { SystemStatus } from "../types";

const API_BASE_URL = "http://localhost:5000";

export const fetchSystemStatus = async (): Promise<SystemStatus> => {
  const response = await fetch(`${API_BASE_URL}/api/status`);
  if (!response.ok) throw new Error("API bağlantı hatası.");

  return response.json();
};

export const VIDEO_FEED_URL = `${API_BASE_URL}/video_feed`;

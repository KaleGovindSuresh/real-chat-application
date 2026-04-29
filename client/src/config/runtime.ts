const PROD_API_FALLBACK = "https://real-chat-application-lmq8.onrender.com";

function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configuredUrl) return configuredUrl;

  if (typeof window !== "undefined" && isLocalHost(window.location.hostname)) {
    return "http://localhost:4000";
  }

  return PROD_API_FALLBACK;
}

export function getSocketUrl() {
  const configuredSocketUrl = import.meta.env.VITE_SOCKET_URL?.trim();
  return configuredSocketUrl || getApiBaseUrl();
}

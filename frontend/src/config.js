// Backend base URL (no trailing slash). Set REACT_APP_API_URL in the hosting
// environment (e.g. Netlify); falls back to the local Spring Boot server.
export const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:8080").replace(/\/$/, "");

export * from "./colors";
export * from "./regionsData";

const ENV_URL = import.meta.env.VITE_SERVER_URL;

export const SERVER_URL = ENV_URL || "http://localhost:5000";

export const API_BASE_URL = SERVER_URL.endsWith("/") ? SERVER_URL.slice(0, -1) : SERVER_URL;

export const IS_DEV = import.meta.env.MODE === "development";

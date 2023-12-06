const env = process.env.NODE_ENV;
export const BACKEND_URL =
  env === "development" ? "http://localhost:4000" : "https://art98-backend.onrender.com";

/**
 * Login details for demo account
 */
export const demoAccountCredentials = {
  email: process.env.DEMO_EMAIL || "error",
  password: process.env.DEMO_PASSWORD || "error",
};

/**
 * Hex colors for color palette
 */
export const canvasColors = [
  "#000000",
  "#FFFFFF",
  "#808080",
  "#FF0000",
  "#FFA500",
  "#FFFF00",
  "#008000",
  "#00FFFF",
  "#0000FF",
  "#800080",
];

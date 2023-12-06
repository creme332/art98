const env = process.env.NODE_ENV;
export const BACKEND_URL =
  env === "development"
    ? "http://localhost:4000"
    : "https://art98-backend.onrender.com";

/**
 * Login details for demo account
 */
export const demoAccountCredentials = {
  email: process.env.NEXT_PUBLIC_DEMO_EMAIL || "Undefined environment variable",
  password:
    process.env.NEXT_PUBLIC_DEMO_PASSWORD || "Undefined environment variable",
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

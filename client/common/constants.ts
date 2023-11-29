const env = process.env.NODE_ENV;
export const BACKEND_URL =
  env === "development" ? "http://localhost:4000" : "https://art98.vercel.app";

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

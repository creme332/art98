const env = process.env.NODE_ENV;
export const BACKEND_URL =
  env === "development" ? "http://localhost:4000" : "https://art98.vercel.app";

import { BACKEND_URL } from "./constants";

export async function fetchCanvas() {
  console.log("Fetching canvas...");
  try {
    const response = await fetch(`${BACKEND_URL}/canvas`, {
      method: "GET",
      credentials: "include",
    });

    const jsonObj = await response.json();

    if (response.ok) {
      console.log("Done. First few elements are:", jsonObj.slice(0, 5));
      return jsonObj;
    }
    // an error occurred
    window.alert(JSON.stringify(jsonObj));
  } catch (error) {
    window.alert(JSON.stringify(error));
  }
}

/**
 * Converts a 6-digit hex color to RGBA where the alpha value is set to 255.
 * @param hexColor event
 *
 * Adapted from: https://stackoverflow.com/a/28056903/17627866
 */
export function hexToRGBA(hexColor: string) {
  const r = parseInt(hexColor.slice(1, 3), 16),
    g = parseInt(hexColor.slice(3, 5), 16),
    b = parseInt(hexColor.slice(5, 7), 16);

  return [r, g, b, 255];
}

export type UserType = "Basic" | "Premium" | "Admin";

export interface User {
  type: UserType;
  email: string;
  name: string;
  password: string;
}

export interface Pixel {
  position: number;
  timestamp: Date;
  author: string;
  color: string;
}

export interface loginDetails {
  email: string;
  password: string;
}

// ------- start of socketio types ----------
// Reference: https://socket.io/docs/v4/typescript/#types-for-the-server

/**
 * A minimalPixel is sent to server and remaining pixel attributes are added by server.
 */
export interface minimalPixel {
  position: number;
  color: string;
}

/**
 * Used when sending and broadcasting events on server or when receiving events on client.
 */
export interface ServerToClientEvents {
  messageResponse: (a: Pixel) => void;
  limitExceeded: () => void; // user exceeded drawing limit
  resetCanvasResponse: () => void; // client is asked to clear his local canvas
  onlineUsernames: (a: string[]) => void; // array of names of online users
}

/**
 * Used when receiving events on server or when sending events from client
 */
export interface ClientToServerEvents {
  message: (pixel: minimalPixel) => void; // send minimum info to server about pixel to be updated
  resetCanvas: () => void; // request server to reset canvas. server may refuse request.
}

// ------- end of socketio types ----------

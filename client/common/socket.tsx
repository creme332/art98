import { io, Socket } from "socket.io-client";
import { BACKEND_URL } from "./constants";
import { ServerToClientEvents, ClientToServerEvents } from "./types";

/**https://socket.io/how-to/use-with-react#example */
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  BACKEND_URL,
  {
    reconnectionDelayMax: 10000,
    autoConnect: false,
    withCredentials: true,
    transports: ["websocket", "polling", "flashsocket"], // https://stackoverflow.com/a/65566581/17627866
  }
);

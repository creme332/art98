import { Socket } from "socket.io-client";

export interface appProps {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

// ------- start of socketio types ----------
// Reference: https://socket.io/docs/v4/typescript/#types-for-the-server

/**
 * Used when sending and broadcasting events on server or when receiving events on client.
 */
export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  messageResponse: (a: string) => void;
}

/**
 * Used when receiving events on server or when sending events from client
 */
export interface ClientToServerEvents {
  message: (a: string) => void;
}

/**
 * Used for inter-server communication (added in socket.io@4.1.0)
 */
export interface InterServerEvents {
  ping: () => void;
}

/**
 * Used to type the socket.data attribute (added in socket.io@4.4.0)
 */
export interface SocketData {
  name: string;
  age: number;
}
// -------  end of socketio types ----------
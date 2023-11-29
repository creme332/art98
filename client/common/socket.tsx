import { io } from "socket.io-client";
import { BACKEND_URL } from "./constants";

/**https://socket.io/how-to/use-with-react#example */
export const socket = io(BACKEND_URL, {
  reconnectionDelayMax: 10000,
  autoConnect: false,
  withCredentials: true,
  //   auth: {
  //     token: "123",
  //   },
  //   query: {
  //     "my-key": "my-value",
  //   },
});

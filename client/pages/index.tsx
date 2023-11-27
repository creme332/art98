import { Container } from "@mantine/core";
import Canvas from "../components/Canvas";
import HeaderSimple from "../components/HeaderSimple";
import Footer from "../components/FooterSimple";
import { io } from "socket.io-client";
import { BACKEND_URL } from "../common/constants";

export default function IndexPage() {
  const socket = io(BACKEND_URL, {
    reconnectionDelayMax: 10000,
    auth: {
      token: "123",
    },
    query: {
      "my-key": "my-value",
    },
  });

  return (
    <Container>
      <HeaderSimple socket={socket} />
      <Canvas socket={socket} />
      <Footer />
    </Container>
  );
}

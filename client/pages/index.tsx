import { Container } from "@mantine/core";
import Canvas from "../components/Canvas";
import { appProps } from "../common/types";
import HeaderSimple from "../components/HeaderSimple";
import Footer from "../components/FooterSimple";

export default function IndexPage({ socket }: appProps) {
  return (
    <Container>
      <HeaderSimple socket={socket} />
      <Canvas socket={socket} />
      <Footer />
    </Container>
  );
}

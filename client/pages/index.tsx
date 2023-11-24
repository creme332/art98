import { Container } from "@mantine/core";
import Canvas from "../components/Canvas";
import { appProps } from "../common/types";
export default function IndexPage({ socket }: appProps) {
  return (
    <Container>
      <Canvas socket={socket} />
    </Container>
  );
}

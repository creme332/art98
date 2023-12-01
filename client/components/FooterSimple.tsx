import { Container, Text, Anchor } from "@mantine/core";
import classes from "../styles/FooterSimple.module.css";

export default function FooterSimple() {
  return (
    <div className={classes.footer}>
      <Container p={10}>
        <Text fz={"xs"}>
          The artwork displayed on this website is user-generated and
          collaborative. Some content might be inappropriate or offensive.
          Please be aware that the images presented do not necessarily reflect
          the views or values of the game creator. The content was created by
          various users and may not align with the creator&apos;s beliefs
          or identity. If you encounter any offensive material, please
          <Anchor
            fw={800}
            c={"#9d3333"}
            fz={"xs"}
            href="https://github.com/creme332/art98/issues"
          >
            {` report it `}
          </Anchor>
          for review.
        </Text>
      </Container>
    </div>
  );
}

import { Title, Text, Button, Container } from "@mantine/core";
import { Dots } from "../components/Dots";
import classes from "../styles/HeroText.module.css";
import Link from "next/link";

export default function HeroText() {
  return (
    <div className={classes.root}>
      <Container className={classes.wrapper}>
        <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
        <Dots className={classes.dots} style={{ right: 0, top: 60 }} />
        <div className={classes.inner}>
          <Title className={classes.title}>
            A real-time{" "}
            <Text component="span" className={classes.highlight} inherit>
              collaborative
            </Text>{" "}
            pixel art canvas
          </Title>
          <Container p={0} size={600}>
            <Text size="lg" c="dimmed" className={classes.description}>
              Inspired by r/place, this website features different users with
              varying privileges.
            </Text>
          </Container>
          <div className={classes.controls}>
            <Button
              component={Link}
              href={"/register"}
              className={classes.control}
              size="lg"
              variant="default"
              color="gray"
            >
              Register
            </Button>
            <Button
              component={Link}
              href={"/login"}
              className={classes.control}
              size="lg"
            >
              Login
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

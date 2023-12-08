import { Title, Text, Button, Container } from "@mantine/core";
import { Dots } from "../components/Dots";
import classes from "../styles/HeroText.module.css";
import Link from "next/link";
import { loginDetails } from "../common/types";
import { demoAccountCredentials } from "../common/constants";
import { useState } from "react";

interface pageProps {
  loginHandler: (details: loginDetails) => void;
}

export default function HomePage({ loginHandler }: pageProps) {
  const [loading, setLoading] = useState(false);

  async function loginToDemo() {
    setLoading(true);
    await loginHandler(demoAccountCredentials);
    setLoading(false);
  }

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
              size="lg"
              variant="outline"
              color="grey"
            >
              Register
            </Button>

            <Button
              loading={loading}
              loaderProps={{ type: "dots" }}
              onClick={loginToDemo}
              size="lg"
            >
              Try demo
            </Button>

            <Button
              component={Link}
              href={"/login"}
              size="lg"
              variant="outline"
              color="grey"
            >
              Login
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

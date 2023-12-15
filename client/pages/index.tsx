import {
  Title,
  Text,
  Button,
  Container,
  Anchor,
  Dialog,
} from "@mantine/core";
import { Dots } from "../components/Dots";
import classes from "../styles/HeroText.module.css";
import Link from "next/link";
import { loginDetails } from "../common/types";
import { demoAccountCredentials } from "../common/constants";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";

interface pageProps {
  loginHandler: (details: loginDetails) => void;
}

export default function HomePage({ loginHandler }: pageProps) {
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(true);

  async function loginToDemo() {
    setLoading(true);
    await loginHandler(demoAccountCredentials);
    setLoading(false);
  }

  return (
    <div className={classes.root}>
      <Dialog
        opened={opened}
        withCloseButton
        onClose={close}
        size="lg"
        radius="md"
      >
        <Text size="sm" mb="xs" fw={500}>
          Cookies
        </Text>
        <Text size="sm" mb="xs">
          This website uses cookies to make requests to the server. If cookies
          are disabled on your browser or if you are using an incognito tab, you
          will not be able to login. If you face login problems, create an issue
          on{" "}
          <Anchor
            fw={800}
            fz={"xs"}
            href="https://github.com/creme332/art98/issues"
          >
            {`Github.`}
          </Anchor>
        </Text>{" "}
      </Dialog>
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
              Inspired by r/place, this{" "}
              <Anchor
                fw={800}
                href="https://github.com/creme332/art98/"
                className={classes.highlight}
              >
                {`open-source`}
              </Anchor>{" "}
              project supports different users with varying privileges.
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

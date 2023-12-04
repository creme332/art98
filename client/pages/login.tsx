import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Anchor,
  Stack,
} from "@mantine/core";
import { SyntheticEvent } from "react";
import Link from "next/link";
import { useState } from "react";
import classes from "../styles/LoginForm.module.css";
import { loginDetails } from "../common/types";

interface pageProps {
  loginHandler: (details: loginDetails) => void;
}

export default function LoginForm({ loginHandler }: pageProps) {
  const [values, setValues] = useState<loginDetails>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  async function submitHandler(e: SyntheticEvent) {
    setLoading(true);
    e.preventDefault();
    console.log(values);
    await loginHandler(values);
    setLoading(false);
  }

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius="md" p="xl" withBorder>
        <Text size="lg" fw={600}>
          Login to art98
        </Text>
        <form onSubmit={submitHandler}>
          <Stack>
            <TextInput
              defaultValue={values.email}
              required
              label="Email"
              placeholder="hello@mantine.dev"
              radius="md"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
            <PasswordInput
              defaultValue={values.password}
              required
              label="Password"
              placeholder="Your password"
              radius="md"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
          </Stack>
          <Group justify="space-between" mt="xl">
            <Anchor
              component={Link}
              type="button"
              c="dimmed"
              href={"/register"}
              size="xs"
            >
              {"Don't have an account? Register"}
            </Anchor>
            <Button
              loading={loading}
              loaderProps={{ type: "dots" }}
              type="submit"
              radius="xl"
            >
              Login
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
}

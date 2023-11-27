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
import { BACKEND_URL } from "../common/constants";
import { useRouter } from "next/router";

interface loginDetails {
  email: string;
  password: string;
}

export default function AuthenticationForm() {
  const router = useRouter();
  const [values, setValues] = useState<loginDetails>({
    email: "",
    password: "",
  });

  async function submitHandler(e: SyntheticEvent) {
    e.preventDefault();
    console.log(values);

    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        router.push("/");
      }
      const json = (await response).json();
      console.log(json);
    } catch (error) {}
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
              required
              label="Email"
              placeholder="hello@mantine.dev"
              radius="md"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
            <PasswordInput
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
            <Button type="submit" radius="xl">
              Login
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
}

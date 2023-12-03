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
import { User } from "../common/types";

interface loginDetails {
  email: string;
  password: string;
}

interface pageProps {
  setLoggedIn: (status: boolean) => void;
  setUserData: (user: User) => void;
}

export default function AuthenticationForm({
  setLoggedIn,
  setUserData,
}: pageProps) {
  const router = useRouter();
  const [values, setValues] = useState<loginDetails>({
    email: "aaaaaa",
    password: "aaaaaa",
  });

  async function getUserData() {
    try {
      const response = await fetch(`${BACKEND_URL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ! important
      });
      console.log(response);

      const json = await response.json();

      if (response.ok) {
        return json;
      }

      // error
      console.log(json);
      window.alert(json.error);
    } catch (error) {
      window.alert(error);
      console.log(error);
    }
  }

  async function submitHandler(e: SyntheticEvent) {
    e.preventDefault();
    console.log(values);

    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ! important
        body: JSON.stringify(values),
      });
      console.log(response);

      if (response.ok) {
        const userData = await getUserData();
        if (userData) {
          setLoggedIn(true);
          setUserData(userData);
          return router.push("/canvas");
        }
      }
      // error
      const json = await response.json();
      console.log(json);
      window.alert(json.error);
    } catch (error) {
      window.alert(error);
      console.log(error);
    }
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
              defaultValue={" "}
              required
              label="Email"
              placeholder="hello@mantine.dev"
              radius="md"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
            <PasswordInput
              defaultValue={" "}
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

import {
  Paper,
  TextInput,
  PasswordInput,
  Radio,
  Button,
  Title,
  Text,
  Group,
  Anchor,
} from "@mantine/core";
import classes from "../styles/AuthForm.module.css";
import Link from "next/link";
import { SyntheticEvent } from "react";
import { useState } from "react";
import { BACKEND_URL } from "../common/constants";

interface User {
  type: "basic" | "premium" | "admin";
  email: string;
  name: string;
  password: string;
}

/**
 * Reference: https://ui.mantine.dev/category/authentication/#authentication-image
 * @returns
 */
export default function RegistrationForm() {
  const [values, setValues] = useState<User>({
    type: "basic",
    email: "",
    password: "",
    name: "",
  });

  async function submitHandler(e: SyntheticEvent) {
    e.preventDefault();
    console.log("submitted", values);

    try {
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const json = response.json();
      console.log(json);
    } catch (error) {}
  }
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          {"Welcome to art98!"}
        </Title>

        <form onSubmit={submitHandler}>
          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
          <TextInput
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            label="Name"
            placeholder="Your name"
            size="md"
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
          <Radio.Group
            size="md"
            mt="md"
            name="type"
            label="Select your role"
            onChange={(e: "basic" | "premium" | "admin") =>
              setValues({ ...values, type: e })
            }
          >
            <Group mt="xs">
              <Radio checked value="basic" label="Basic" />
              <Radio value="premium" label="Premium" />
              <Radio value="admin" label="Administrator" />
            </Group>
          </Radio.Group>
          <Button type="submit" fullWidth mt="xl" size="md">
            {"Register"}
          </Button>
        </form>

        <Text ta="center" mt="md">
          {"Already have an account?"}
          <Anchor component={Link} href={"/login"} fw={700}>
            {" Login"}
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}

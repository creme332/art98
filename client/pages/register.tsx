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
import { User } from "../common/types";

interface specialUser extends User {
  secret?: string;
}

/**
 * Reference: https://ui.mantine.dev/category/authentication/#authentication-image
 * @returns
 */
export default function RegistrationForm() {
  const [values, setValues] = useState<specialUser>({
    type: "basic",
    email: "",
    password: "",
    name: "",
  });

  async function submitHandler(e: SyntheticEvent) {
    e.preventDefault();

    console.log("Submitted: ", values);

    try {
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        window.alert("Registration successful! You may now login.");
        return;
      }
      // else an error occurred
      const json = await response.json();
      window.alert(json.error);
    } catch (error) {
      window.alert(error);
    }
  }
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          {"Welcome to art98!"}
        </Title>

        <form onSubmit={submitHandler}>
          <TextInput
            required
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
          <TextInput
            required
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            label="Name"
            placeholder="Your name"
            size="md"
          />
          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
          <Radio.Group
            required
            size="md"
            mt="md"
            name="type"
            label="Select your role"
            defaultValue="Basic"
            onChange={(e: "basic" | "premium" | "admin") =>
              setValues({ ...values, type: e })
            }
          >
            <Group mt="xs">
              <Radio checked value="Basic" label="Basic" />
              <Radio value="Premium" label="Premium" />
              <Radio value="Admin" label="Administrator" />
            </Group>
          </Radio.Group>

          {/* If user's role is set to premium or administrator, ask for secret */}
          {values.type !== "basic" && (
            <TextInput
              mt="md"
              required
              label="Secret key"
              placeholder="Enter secret key"
              size="md"
              onChange={(e) => setValues({ ...values, secret: e.target.value })}
            />
          )}
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

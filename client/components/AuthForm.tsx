import {
  Paper,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
} from "@mantine/core";
import classes from "../styles/AuthForm.module.css";
import Link from "next/link";

/**
 * Reference: https://ui.mantine.dev/category/authentication/#authentication-image
 * @returns
 */
export default function AuthForm({ type }: { type: "register" | "login" }) {
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          {type == "register" ? "Welcome to art98!" : "Welcome back to art98!"}
        </Title>

        <TextInput
          label="Email address"
          placeholder="hello@gmail.com"
          size="md"
        />
        <TextInput label="Name" placeholder="Your name" size="md" />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
        />
        <Checkbox label="Keep me logged in" mt="xl" size="md" />
        <Button fullWidth mt="xl" size="md">
          {type == "register" ? "Register" : "Login"}
        </Button>

        <Text ta="center" mt="md">
          {type == "register"
            ? "Already have an account?"
            : "Don't have an account? "}
          <Anchor
            component={Link}
            href={type == "register" ? " /login" : " /register"}
            fw={700}
          >
            {type == "register" ? " Login" : " Register"}
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}

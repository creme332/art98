import "@mantine/core/styles.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { theme } from "../theme";
import { useState } from "react";
import { User, loginDetails } from "../common/types";
import { BACKEND_URL } from "../common/constants";
import { useRouter } from "next/router";
import { UserType } from "../common/types";

interface AppProps {
  Component: () => JSX.Element;
  pageProps: any;
}

export default function App({ Component, pageProps }: AppProps) {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter();

  function updateLoginStatus(status: boolean) {
    setLoggedIn(status);
  }

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

  async function updateUserPlan(newType: UserType, secret: string | null) {
    if (newType === userData?.type) return;

    try {
      const response = await fetch(`${BACKEND_URL}/upgrade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ! important
        body: JSON.stringify({ type: newType, secret }),
      });
      console.log(response);

      if (response.ok) {
        window.alert("Success! Please login again.");
        return router.push("/");
      }
      // error
      const json = await response.json();
      console.log(json);
      window.alert(json.error);
    } catch (error) {
      window.alert("Server is down. Please try again later.");
      console.error(error);
    }
  }

  async function loginHandler(loginDetails: loginDetails) {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ! important
        body: JSON.stringify(loginDetails),
      });
      console.log(response);

      if (response.ok) {
        console.log("Login successful");
        const userData = await getUserData();
        if (userData) {
          setLoggedIn(true);
          setUserData(userData);
          return router.push("/canvas");
        }

        // no user data available
        return;
      }
      // error
      const json = await response.json();
      console.log(json);
      window.alert(json.error);
    } catch (error) {
      window.alert("Server is down. Please try again later.");
      console.error(error);
    }
  }

  return (
    <MantineProvider theme={theme}>
      <Head>
        <meta charSet="utf-8" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎨</text></svg>"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Engage in real-time pixel art creation on our collaborative canvas. Join artists worldwide in crafting a visual masterpiece!"
        />
        <title>art98</title>
      </Head>
      <Component
        {...pageProps}
        loggedIn={loggedIn}
        setLoggedIn={updateLoginStatus}
        userData={userData}
        loginHandler={loginHandler}
        updateUserPlan={updateUserPlan}
      />
    </MantineProvider>
  );
}

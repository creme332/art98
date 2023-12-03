import "@mantine/core/styles.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { theme } from "../theme";
import { useState } from "react";
import { User } from "../common/types";

interface AppProps {
  Component: () => JSX.Element;
  pageProps: any;
}

export default function App({ Component, pageProps }: AppProps) {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(null);

  function updateUserData(user: User) {
    setUserData(user);
  }

  function updateLoginStatus(status: boolean) {
    setLoggedIn(status);
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
        setUserData={updateUserData}
      />
    </MantineProvider>
  );
}

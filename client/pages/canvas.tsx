import { Container } from "@mantine/core";
import Canvas from "../components/Canvas";
import HeaderSimple from "../components/HeaderSimple";
import Footer from "../components/FooterSimple";
import { io } from "socket.io-client";
import { BACKEND_URL } from "../common/constants";
import { useRouter } from "next/router";

interface pageProps {
  loggedIn: boolean;
  setLoggedIn: (status: boolean) => void;
}

export default function IndexPage({ loggedIn, setLoggedIn }: pageProps) {
  const router = useRouter();

  if (!loggedIn) {
    router.push("/login");
  }
  
  const socket = io(BACKEND_URL, {
    reconnectionDelayMax: 10000,
    withCredentials: true,
    auth: {
      token: "123",
    },
    query: {
      "my-key": "my-value",
    },
  });

  return (
    <div>
      <HeaderSimple socket={socket} />
      {loggedIn && (
        <Container>
          <Canvas socket={socket} />
        </Container>
      )}
      <Footer />
    </div>
  );
}

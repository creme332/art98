import { Container } from "@mantine/core";
import Canvas from "../components/Canvas";
import HeaderSimple from "../components/HeaderSimple";
import Footer from "../components/FooterSimple";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface pageProps {
  loggedIn: boolean;
  setLoggedIn: (status: boolean) => void;
}

export default function IndexPage({ loggedIn, setLoggedIn }: pageProps) {
  const router = useRouter();

  useEffect(() => {
    if (!loggedIn) {
      router.push("/login");
    }
  }, []);

  return (
    <div>
      <HeaderSimple loggedIn={loggedIn} />
      {loggedIn && (
        <Container>
          <Canvas loggedIn={loggedIn} />
        </Container>
      )}
      <Footer />
    </div>
  );
}

import { Container } from "@mantine/core";
import Canvas from "../components/Canvas";
import HeaderSimple from "../components/HeaderSimple";
import Footer from "../components/FooterSimple";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { User } from "../common/types";

interface pageProps {
  loggedIn: boolean;
  userData: User;
}

export default function IndexPage({ loggedIn, userData }: pageProps) {
  const router = useRouter();

  useEffect(() => {
    if (!loggedIn) {
      router.push("/login");
    }
  }, [loggedIn, router]);

  return (
    <div>
      <HeaderSimple loggedIn={loggedIn} userType={userData?.type} />
      {loggedIn && (
        <Container>
          <Canvas loggedIn={loggedIn} userData={userData} />
        </Container>
      )}
      <Footer />
    </div>
  );
}

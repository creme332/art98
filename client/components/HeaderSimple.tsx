import {
  Group,
  Button,
  Text,
  Box,
  HoverCard,
  UnstyledButton,
} from "@mantine/core";
import classes from "../styles/HeaderSimple.module.css";
import { IconPaint } from "@tabler/icons-react";
import { IconLock } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../common/constants";
import { useRouter } from "next/router";
import { socket } from "../common/socket";

interface headerProps {
  loggedIn: boolean;
}

export default function HeaderSimple({ loggedIn }: headerProps) {
  const [playerCount, setPlayerCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // check if user logged in
    if (loggedIn) {
      socket.connect();
      socket.on("userCount", (data) => {
        setPlayerCount(data);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [loggedIn]);

  async function handleLogOut() {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
      });
      console.log(response);
      if (response.ok) {
        socket.disconnect();
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box pb={50}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Group aria-label="art98 logo">
            <IconPaint />
            <Text size="xl" fw={900}>
              art98
            </Text>
          </Group>
          <HoverCard width={280} shadow="md">
            <HoverCard.Target>
              <UnstyledButton>
                {" "}
                <Text size="md" fw={600}>
                  {playerCount} {playerCount > 1 ? "players " : "player"} online
                </Text>
              </UnstyledButton>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Group>
                <IconLock />
                <Text size="sm">
                  Only premium users and administrators can see the identities
                  of online users.
                </Text>
              </Group>
            </HoverCard.Dropdown>
          </HoverCard>

          <Group visibleFrom="sm">
            <Button
              onClick={handleLogOut}
              aria-label="Log out"
              variant="default"
            >
              Log out
            </Button>
          </Group>
        </Group>
      </header>
    </Box>
  );
}

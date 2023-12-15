import {
  Group,
  Button,
  Text,
  Box,
  HoverCard,
  Badge,
  UnstyledButton,
} from "@mantine/core";
import classes from "../styles/HeaderSimple.module.css";
import { IconPaint } from "@tabler/icons-react";
import { IconLock } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../common/constants";
import { useRouter } from "next/router";
import { socket } from "../common/socket";
import Link from "next/link";

interface headerProps {
  loggedIn: boolean;
  userType: string;
}

export default function HeaderSimple({ loggedIn, userType }: headerProps) {
  const [playerCount, setPlayerCount] = useState(0);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // check if user logged in
    if (loggedIn) {
      socket.connect();
      socket.on("onlineUsernames", (data) => {
        setPlayerCount(data.length);
        setPlayerNames(data);
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
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  function UserBadge() {
    if (userType === "Basic") {
      return <Badge color="gray">Basic</Badge>;
    }
    if (userType === "Premium") {
      return <Badge color="yellow">Premium</Badge>;
    }
    if (userType === "Admin") {
      return (
        <Badge
          variant="gradient"
          gradient={{ from: "violet", to: "grape", deg: 360 }}
        >
          Admin
        </Badge>
      );
    }
    return <Badge color="gray">Basic</Badge>;
  }

  function displayUsernames() {
    if (userType === "Basic") {
      return (
        <Group>
          <IconLock />
          <Text size="sm">
            Only premium users and administrators can see the identities of
            online users.
          </Text>
        </Group>
      );
    }
    return <Text> {playerNames?.join(", ")}</Text>;
  }
  return (
    <Box pb={50}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Group aria-label="art98 logo" visibleFrom="sm">
            <IconPaint />
            <Text size="xl" fw={900}>
              art98
            </Text>
          </Group>

          <Group>
            <Link href="/upgrade">{UserBadge()}</Link>
            <HoverCard width={280} shadow="md">
              <HoverCard.Target>
                <UnstyledButton>
                  {" "}
                  <Text size="md" fw={600}>
                    {playerCount} {playerCount > 1 ? "players " : "player"}{" "}
                    online
                  </Text>
                </UnstyledButton>
              </HoverCard.Target>
              <HoverCard.Dropdown>{displayUsernames()}</HoverCard.Dropdown>
            </HoverCard>
          </Group>

          <Group>
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

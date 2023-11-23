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

export default function HeaderSimple({ playerCount }: { playerCount: number }) {
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
            <Button aria-label="Log out" variant="default">
              Log out
            </Button>
          </Group>
        </Group>
      </header>
    </Box>
  );
}

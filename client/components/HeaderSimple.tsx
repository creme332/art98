import { Group, Button, Text, Box } from "@mantine/core";
import classes from "../styles/HeaderSimple.module.css";
import { IconPaint } from "@tabler/icons-react";

export default function HeaderSimple({ playerCount }: { playerCount: number }) {
  return (
    <Box pb={50}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Group>
            <IconPaint />
            <Text size="xl" fw={900}>
              art98
            </Text>
          </Group>
          <Text size="md" fw={600}>
            {playerCount} {playerCount > 1 ? "players " : "player"} online
          </Text>
          <Group visibleFrom="sm">
            <Button variant="default">Log out</Button>
          </Group>
        </Group>
      </header>
    </Box>
  );
}

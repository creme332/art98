import {
  Title,
  Button,
  Text,
  Card,
  Group,
  SimpleGrid,
  Container,
  rem,
} from "@mantine/core";
import { IconEggCracked, IconEgg, IconSpider } from "@tabler/icons-react";
import classes from "../styles/FeaturesCards.module.css";
import React from "react";
import { User, UserType } from "../common/types";
import { useEffect } from "react";

interface planInterface {
  title: UserType;
  description: string;
  icon: React.ElementType;
  color: string;
}
const plans: planInterface[] = [
  {
    title: "Basic",
    description: "You are limited to 5 pixels per minute.",
    icon: IconEgg,
    color: "black",
  },
  {
    title: "Premium",
    description: "You are limited to 20 pixels per minute.",
    icon: IconEggCracked,
    color: "orange",
  },
  {
    title: "Admin",
    description:
      "You can draw any number of pixels, reset canvas, and much more.",
    icon: IconSpider,
    color: "purple",
  },
];

interface pageProps {
  updateUserPlan: (newType: UserType, secret: string | null) => void;
  userData: User;
}

export default function UpgradePage({ updateUserPlan, userData }: pageProps) {
  const userType = userData?.type || null;

  function clickHandler(newPlan: UserType) {
    if (!userType) return;

    if (newPlan !== "Basic") {
      // ask user for secret
      const secret = prompt("Enter secret:");
      return updateUserPlan(newPlan, secret);
    }
    updateUserPlan(newPlan, null);
  }

  useEffect(() => {
    if (!userType) {
      window.alert("Please login to continue");
    }
  }, [userType]);

  const features = plans.map((plan) => (
    <Card
      key={plan.title}
      shadow="md"
      radius="md"
      className={classes.card}
      padding="xl"
    >
      <plan.icon
        style={{ width: rem(50), height: rem(50) }}
        stroke={2}
        color={plan.color}
      />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {plan.title}
      </Text>
      <Group h={60}>
        <Text fz="sm" c="dimmed" mt="sm">
          {plan.description}
        </Text>
      </Group>

      {userType === plan.title || !userType ? (
        <Button disabled variant="outline" color="black" mt={10}>
          Current plan
        </Button>
      ) : (
        <Button
          onClick={() => clickHandler(plan.title)}
          variant="outline"
          color="black"
          mt={10}
        >
          Choose
        </Button>
      )}
    </Card>
  ));

  return (
    <Container size="lg" py="xl">
      <Title order={2} className={classes.title} ta="center" mt="sm">
        Upgrade plan
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        Upgrade your plan to unlock advanced privileges! After choosing your new
        plan you must login again for the changes to take effect.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  );
}

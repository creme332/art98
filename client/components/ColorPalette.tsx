import { Group, ColorSwatch, CheckIcon, rem } from "@mantine/core";
import { useState, useEffect } from "react";
import { canvasColors } from "../common/constants";

interface paletteProps {
  updatePixelColor: (hexColor: string) => void;
}

export default function ColorPalette({ updatePixelColor }: paletteProps) {
  const [activeColorIndex, setActiveColor] = useState(0);

  useEffect(() => {
    updatePixelColor(canvasColors[activeColorIndex]);
  }, [updatePixelColor, activeColorIndex]);

  function activateColor(index: number) {
    if (index === activeColorIndex) {
      // unselect current color
      setActiveColor(-1);
      updatePixelColor("");
    } else {
      // select another color
      setActiveColor(index);
      updatePixelColor(canvasColors[index]);
    }
  }

  return (
    <Group>
      {canvasColors.map((c, index) => (
        <ColorSwatch
          key={`colorswatch-${c}`}
          aria-label={`color ${c}`}
          onClick={() => activateColor(index)}
          color={c}
        >
          {" "}
          {index == activeColorIndex && (
            <CheckIcon
              style={{
                width: rem(12),
                height: rem(12),
                color: "white",
              }}
            />
          )}
        </ColorSwatch>
      ))}
    </Group>
  );
}

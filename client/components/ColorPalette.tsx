import { Group, ColorSwatch, CheckIcon, rem } from "@mantine/core";
import { useState } from "react";

interface paletteProps {
  updatePixelColor: (hexColor: string) => void;
}

export default function ColorPalette({ updatePixelColor }: paletteProps) {
  const colors = [
    "#000000",
    "#FFFFFF",
    "#808080",
    "#FF0000",
    "#FFA500",
    "#FFFF00",
    "#008000",
    "#00FFFF",
    "#0000FF",
    " #800080",
  ];
  const [activeColorIndex, setActiveColor] = useState(-1);

  function activateColor(index: number) {
    if (index === activeColorIndex) {
      // unselect current color
      setActiveColor(-1);
      updatePixelColor("");
    } else {
      // select another color
      setActiveColor(index);
      updatePixelColor(colors[index]);
    }
  }

  return (
    <Group>
      {colors.map((c, index) => (
        <ColorSwatch
          key={`colorswatch-${c}`}
          onClick={() => activateColor(index)}
          color={c}
        >
          {" "}
          {index == activeColorIndex && (
            <CheckIcon
              style={{
                width: rem(12),
                height: rem(12),
                outline: "1px solid white",
              }}
            />
          )}
        </ColorSwatch>
      ))}
    </Group>
  );
}

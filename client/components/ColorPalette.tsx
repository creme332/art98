import { Group, ColorSwatch, CheckIcon, rem } from "@mantine/core";
import { useState, useEffect } from "react";
import { canvasColors } from "../common/constants";

interface paletteProps {
  updatePixelColor: (hexColor: string) => void;
}

export default function ColorPalette({ updatePixelColor }: paletteProps) {
  const [activeColorIndex, setActiveColorIndex] = useState(0);

  useEffect(() => {
    updatePixelColor(canvasColors[activeColorIndex]);
  }, [updatePixelColor, activeColorIndex]);

  function activateColor(index: number) {
    if (index === activeColorIndex) {
      // unselect current color
      setActiveColorIndex(-1);
      updatePixelColor("");
    } else {
      // select another color
      setActiveColorIndex(index);
      updatePixelColor(canvasColors[index]);
    }
  }

  function getTickColor() {
    const c = canvasColors[activeColorIndex]; // current color swatch color
    // on white and yellow backgrounds, make tick black
    if (c === "#FFFFFF" || c === "#FFFF00") return "black";
    return "white";
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
                color: getTickColor(),
              }}
            />
          )}
        </ColorSwatch>
      ))}
    </Group>
  );
}

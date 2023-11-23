import styles from "../styles/Canvas.module.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import React, { useEffect, useRef, useState } from "react";
import { Group, ActionIcon, Stack } from "@mantine/core";
import { IconZoomIn, IconZoomOut, IconZoomReset } from "@tabler/icons-react";
import ColorPalette from "./ColorPalette";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scale, setScale] = useState(4);
  const canvasSizeInPixels = 300; // number of pixels on canvas will be canvasSizeInPixels * canvasSizeInPixels
  const canvasColor = "white";
  const [pixelColor, setPixelColor] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // paint canvas
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvasSizeInPixels, canvasSizeInPixels);

    // plotPixel(0, 0);
    // TODO: use imageData to fill canvas initially
  }, []);

  function handleClick(e: React.MouseEvent<Element, MouseEvent>) {
    // Detect right click only
    if (e.type !== "contextmenu") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    console.log(e);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    // calculate coordinates clicked on grid, taking scale into consideration
    const x = Math.floor((e.clientX - rect.left) / scale);
    const y = Math.floor((e.clientY - rect.top) / scale);
    console.log("x: " + x + " y: " + y);

    plotPixel(x, y);
  }

  /**
   * Plots a pixel (a unit square) on the canvas
   * @param x row number of pixel
   * @param y column number of pixel
   * @returns
   */
  function plotPixel(x: number, y: number) {
    const pixelSize: number = 1;

    // validate parameters
    if (x < 0 || x > canvasSizeInPixels || y < 0 || y > canvasSizeInPixels)
      return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = pixelColor;
    ctx.fillRect(x, y, pixelSize, pixelSize);
  }

  function handleScaleChange(e: {
    instance: { transformState: { scale: any } };
  }) {
    const x = e.instance.transformState.scale;
    // console.log("scale = ", x);
    setScale(x);
  }

  function updatePixelColor(hexColor: string) {
    if (hexColor.length !== 7) {
      setPixelColor("black");
    } else {
      setPixelColor(hexColor);
    }
  }

  const canvasElement = (
    <canvas
      height={canvasSizeInPixels}
      width={canvasSizeInPixels}
      onMouseDown={(event) => {
        // disable panning and zooming for right mouse click
        if (event.button == 2) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
      onContextMenu={handleClick}
      className={styles.canva}
      ref={canvasRef}
    />
  );

  return (
    <TransformWrapper
      initialScale={scale}
      onTransformed={handleScaleChange}
      maxScale={20}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <Stack>
          <Group justify="space-between">
            <Group>
              <ActionIcon
                onClick={() => zoomIn()}
                variant="light"
                aria-label="Zoom in"
                color="black"
              >
                <IconZoomIn
                  style={{ width: "70%", height: "70%" }}
                  stroke={2}
                />
              </ActionIcon>
              <ActionIcon
                onClick={() => zoomOut()}
                variant="light"
                aria-label="Zoom out"
                color="black"
              >
                <IconZoomOut
                  style={{ width: "70%", height: "70%" }}
                  stroke={2}
                />
              </ActionIcon>
              <ActionIcon
                onClick={() => resetTransform()}
                variant="light"
                aria-label="Zoom reset"
                color="black"
              >
                <IconZoomReset
                  style={{ width: "70%", height: "70%" }}
                  stroke={2}
                />
              </ActionIcon>
            </Group>
            <ColorPalette updatePixelColor={updatePixelColor} />
          </Group>
          <TransformComponent
            wrapperStyle={{
              width: "100%",
              height: "500px",
              maxWidth: "100%",
              outline: "1px solid",
            }}
          >
            {canvasElement}
          </TransformComponent>
        </Stack>
      )}
    </TransformWrapper>
  );
}

import styles from "../styles/Canvas.module.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import React, { useEffect, useRef, useState } from "react";
import { Group, ActionIcon, Stack, Button, Tooltip, Text } from "@mantine/core";
import { IconZoomIn, IconZoomOut, IconZoomReset } from "@tabler/icons-react";
import ColorPalette from "./ColorPalette";
import { appProps } from "../common/types";

export default function Canvas({ socket }: appProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scale, setScale] = useState(4);
  const canvasSizeInPixels = 300; // number of pixels on canvas will be canvasSizeInPixels * canvasSizeInPixels
  const canvasColor = "white";
  const [selectedPixelColor, setSelectedPixelColor] = useState("");
  const [cursorOnCanvas, setCursorOnCanvas] = useState(false); // is cursor on canvas
  const [coordinates, setCoordinates] = useState("");

  // When canvas component has loaded, initialise everything
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // paint canvas
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvasSizeInPixels, canvasSizeInPixels);

    console.log(ctx.getImageData(0, 0, canvasSizeInPixels, canvasSizeInPixels));
    // plotPixel(0, 0);
    drawArt();
    // TODO: use imageData to fill canvas initially
  }, []);

  useEffect(() => {
    console.log(socket);
    if (!socket) return;
    socket.on("messageResponse", (data) => console.log(data));
  }, [socket]);

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

    plotPixel(x, y, selectedPixelColor);

    socket.emit("message", "bruuh");
  }

  /**
   * Plots a pixel (a unit square) on the canvas
   * @param x row number of pixel
   * @param y column number of pixel
   * @param color HEX code for color of pixel
   * @returns
   */
  function plotPixel(x: number, y: number, color: string) {
    const pixelSize: number = 1;

    // validate parameters
    if (x < 0 || x > canvasSizeInPixels || y < 0 || y > canvasSizeInPixels)
      return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, pixelSize, pixelSize);
  }

  function handleScaleChange(e: {
    instance: { transformState: { scale: any } };
  }) {
    const x = e.instance.transformState.scale;
    // console.log("scale = ", x);
    setScale(x);
  }

  function drawArt() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;

    for (let p = 0; p < 100; p += 4) {
      pixels[p + 0] = 1;
      pixels[p + 1] = 127;
      pixels[p + 2] = 255;
      pixels[p + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
  }

  function updatePixelColor(hexColor: string) {
    if (hexColor.length !== 7) {
      setSelectedPixelColor("black");
    } else {
      setSelectedPixelColor(hexColor);
    }
  }

  function displayLiveCoordinates(e: React.MouseEvent<Element, MouseEvent>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    // calculate coordinates clicked on grid, taking scale into consideration
    const x = Math.floor((e.clientX - rect.left) / scale);
    const y = Math.floor((e.clientY - rect.top) / scale);

    const formattedString = `(${x}, ${y})`;
    setCoordinates(formattedString);
  }

  function clearCanvas() {
    if (
      !confirm("Are you sure to reset the canvas? This action is irreversible.")
    )
      return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      onMouseEnter={(e) => {
        setCursorOnCanvas(true);
        displayLiveCoordinates(e);
      }}
      onMouseMove={(e) => {
        if (!cursorOnCanvas) {
          return;
        }
        displayLiveCoordinates(e);
      }}
      onMouseLeave={() => setCursorOnCanvas(false)}
      onContextMenu={handleClick}
      className={styles.canva}
      ref={canvasRef}
    />
  );

  return (
    <Stack>
      <TransformWrapper
        initialScale={scale}
        onTransformed={handleScaleChange}
        maxScale={20}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <Stack>
            <Group justify="space-between">
              <Group>
                <Tooltip label="Zoom in">
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
                </Tooltip>
                <Tooltip label="Zoom out">
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
                </Tooltip>
                <Tooltip label="Zoom reset">
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
                </Tooltip>
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
      <Text fz={"md"}>{`Pixel position = ${coordinates}`}</Text>
      <Button
        aria-label="Clear canvas"
        onClick={clearCanvas}
        variant="light"
        color="red"
      >
        Clear canvas
      </Button>
    </Stack>
  );
}
import styles from "../styles/Canvas.module.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import React, { useEffect, useRef, useState } from "react";
import {
  Group,
  ActionIcon,
  Stack,
  Button,
  Tooltip,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconZoomIn, IconZoomOut, IconZoomReset } from "@tabler/icons-react";
import ColorPalette from "./ColorPalette";
import { socket } from "../common/socket";
import { BACKEND_URL } from "../common/constants";
import { User } from "../common/types";

interface pageProps {
  loggedIn: boolean;
  userData: User;
}

export default function Canvas({ loggedIn, userData }: pageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scale, setScale] = useState(4);
  const canvasSizeInPixels = 100; // number of pixels on canvas on each row and column of canvas
  const [selectedPixelColor, setSelectedPixelColor] = useState(""); // color of paintbrush
  const [coordinates, setCoordinates] = useState("()"); // coordinates of cursor position on canvas
  const [drawing, setDrawing] = useState(false); // is user currently drawing
  const [visibleLoading, loadingOverlayHandler] = useDisclosure(true);

  // When canvas component has loaded, initialize everything
  useEffect(() => {
    function setupSocketConnection() {
      // setup socket after initializing canvas
      socket.on("messageResponse", (data) => {
        const row = Math.floor(data.position / canvasSizeInPixels);
        const column = data.position % canvasSizeInPixels;
        plotPixel(column, row, data.color);
      });

      socket.on("limit-exceeded", () => {
        window.alert("Drawing limit exceeded. Please wait.");
      });

      // ! connect AFTER defining events because server might send
      // ! events on connection.
      socket.connect();
    }

    async function fetchCanvas() {
      console.log("Fetching canvas...");
      try {
        const response = await fetch(`${BACKEND_URL}/canvas`, {
          method: "GET",
          credentials: "include",
        });

        const jsonObj = await response.json();

        if (response.ok) {
          // no error
          console.log("Done");
          return jsonObj;
        }

        // an error occurred
        window.alert(JSON.stringify(jsonObj));
      } catch (error) {
        window.alert(JSON.stringify(error));
      }
    }

    function fillCanvas(colorArray: [string]) {
      /**
       * Converts a 6-digit hex color to RGBA where the alpha value is set to 255.
       * @param hexColor event
       *
       * Adapted from: https://stackoverflow.com/a/28056903/17627866
       */
      function hexToRGBA(hexColor: string) {
        const r = parseInt(hexColor.slice(1, 3), 16),
          g = parseInt(hexColor.slice(3, 5), 16),
          b = parseInt(hexColor.slice(5, 7), 16);

        return [r, g, b, 255];
      }

      if (!colorArray) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const canvasData = imgData.data;
      const totalPixelCount = canvasSizeInPixels * canvasSizeInPixels;

      for (let p = 0; p < 4 * totalPixelCount; p += 4) {
        const pixelPosition = Math.floor(p / 4);
        const [r, g, b, a] = hexToRGBA(colorArray[pixelPosition]);

        canvasData[p + 0] = r;
        canvasData[p + 1] = g;
        canvasData[p + 2] = b;
        canvasData[p + 3] = a;
      }

      ctx.putImageData(imgData, 0, 0);
    }

    (async () => {
      if (!loggedIn) return;

      loadingOverlayHandler.open();
      const canvasColorsArray = await fetchCanvas();
      fillCanvas(canvasColorsArray);
      setupSocketConnection();
      loadingOverlayHandler.close();
    })();

    return () => {
      socket.disconnect();
    };

    // ! Do not include loadingOverlayHandler as hook dependency
    // ! as it causes a bug whereby the hook gets executed infinitely.
  }, [loggedIn]);

  function handleDraw(e: React.MouseEvent<Element, MouseEvent>) {
    const [x, y] = getCanvasCursorCoordinates(e);

    // inform server of changes
    socket.emit("message", {
      position: canvasSizeInPixels * y + x,
      color: selectedPixelColor,
    });
  }

  /**
   * Plots a pixel (a unit square) on the canvas
   * @param x column number of pixel
   * @param y row number of pixel
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

  /**
   * Save scale factor when user is zooming in/out
   * @param e event
   */
  function handleScaleChange(e: {
    instance: { transformState: { scale: any } };
  }) {
    const x = e.instance.transformState.scale;
    setScale(x);
  }

  function updatePixelColor(hexColor: string) {
    if (!hexColor) return;
    if (hexColor.length !== 7) {
      setSelectedPixelColor("black");
    } else {
      setSelectedPixelColor(hexColor);
    }
  }

  /**
   * Calculate coordinates of mouse event on canvas, taking scale factor into consideration.
   * @param e Mouse event
   * @returns An array of size 2 where first element is column index and second element is row index.
   * Array may be equal to [-1, -1] in the case where canvas is null.
   */
  function getCanvasCursorCoordinates(
    e: React.MouseEvent<Element, MouseEvent>
  ) {
    const canvas = canvasRef.current;
    if (!canvas) return [-1, -1];

    const rect = canvas.getBoundingClientRect();

    // calculate coordinates clicked on grid, taking scale into consideration
    const x = Math.floor((e.clientX - rect.left) / scale);
    const y = Math.floor((e.clientY - rect.top) / scale);

    return [x, y];
  }

  /**
   * Updates cursor coordinates
   * @param e Mouse event
   */
  function displayLiveCoordinates(e: React.MouseEvent<Element, MouseEvent>) {
    const [x, y] = getCanvasCursorCoordinates(e);
    const formattedString = `(${y}, ${x})`;
    setCoordinates(formattedString);
  }

  function clearCanvas() {
    // add some basic validation on top of server-side validation
    if (userData.type !== "Admin") {
      return window.alert("Forbidden action");
    }

    // ask for confirmation before clearing canvas
    if (
      !confirm("Are you sure to reset the canvas? This action is irreversible.")
    )
      return;

    socket.emit("reset-canvas");
  }

  const canvasElement = (
    <canvas
      height={canvasSizeInPixels}
      width={canvasSizeInPixels}
      onMouseEnter={(e) => {
        // mouse entered canvas
        displayLiveCoordinates(e); // show live cursor coordinates
      }}
      onMouseMove={(e) => {
        displayLiveCoordinates(e);

        if (drawing) {
          // plot pixels on right mouse hold
          handleDraw(e);
        }
      }}
      onMouseDown={(e) => {
        // check if right mouse button is clicked
        if (e.button == 2) {
          // disable panning and zooming for right mouse click
          e.preventDefault();
          e.stopPropagation();

          setDrawing(true); // allow drawing
        }
      }}
      onMouseUp={(event) => {
        // check if right mouse button is released on canvas
        if (event.button == 2) {
          setDrawing(false);
        }
      }}
      onMouseLeave={() => {
        setDrawing(false);
      }}
      onContextMenu={(e) => {
        //  This function allows user to draw a single pixel while mouse is not moving.
        // Prevent context menu from opening
        e.preventDefault();
        e.stopPropagation();

        setDrawing(true);
        handleDraw(e);
        setDrawing(false);
      }}
      className={styles.canva}
      ref={canvasRef}
    />
  );

  return (
    <Stack pos="relative">
      <LoadingOverlay
        visible={visibleLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

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
      {userData?.type === "Admin" && (
        <Button
          aria-label="Clear canvas"
          onClick={clearCanvas}
          variant="light"
          color="red"
        >
          Clear canvas
        </Button>
      )}
    </Stack>
  );
}

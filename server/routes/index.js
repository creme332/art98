const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const canvasController = require("../controllers/canvas_controller");

router.get("/", (req, res, next) => {
  res.json({ message: "Hello world" });
});

router.get("/canvas", canvasController.pixels_color);

module.exports = router;

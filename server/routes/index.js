const express = require("express");
const router = express.Router();
const canvasController = require("../controllers/canvas_controller");

router.get("/", function (req, res, next) {
  res.json({ message: "Hello world" });
});

router.get("/canvas", canvasController.pixels_color);

module.exports = router;

const asyncHandler = require("express-async-handler");
const Canvas = require("../models/canvas");

exports.pixels_color = asyncHandler(async (req, res, next) => {
  const isAuthenticated = !!req.user;
  console.log(req.user);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "User is not authenticated" });
  }

  const canvas = await Canvas.findOne(); // There's only 1 canvas in database
  const pixels = await Canvas.aggregate([
    {
      // perform aggregation on a single canvas
      $match: { _id: canvas._id },
    },
    {
      // replace each object id in pixels array by actual pixel dictionary
      $lookup: {
        from: "pixels",
        localField: "pixels",
        foreignField: "_id",
        as: "pixels",
      },
    },
    {
      // remove canvas id from result
      $project: { _id: 0 },
    },
    {
      // sort pixels array in ascending order of position
      $project: {
        _id: 0,
        pixels: {
          $sortArray: {
            input: "$pixels",
            sortBy: { position: 1 },
          },
        },
      },
    },
    {
      // return only pixel color
      $project: {
        "pixels.color": 1,
      },
    },
  ]);
  /*
  Result from mongodb looks like this:
  [{"pixels":[{"color":"white"},{"color":"white"},
  {"color":"white"},{"color":"white"}]}]
  We want: ["white","white","white","white"]
  */
  // return an array of colors
  const final = pixels[0].pixels.map((el) => el.color);
  res.json(final);
});

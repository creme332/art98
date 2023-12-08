const asyncHandler = require("express-async-handler");
const Pixel = require("../models/pixel");

exports.pixels_data = asyncHandler(async (req, res, next) => {
  console.log(req.session);

  if (!req.user) {
    return res.status(401).json({ error: "User is not authenticated" });
  }

  const pixels = await Pixel.aggregate([
    {
      // remove unnecessary fields
      $project: { _id: 0, canvas: 0, _v: 0 },
    },
    {
      // join pixels and users databases on user id field
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
      },
      // authorDetails is an array with a single object
    },
    {
      // get only name field from the only object authorDetails
      $project: {
        position: 1,
        color: 1,
        timestamp: 1,
        author: { $first: "$authorDetails.name" },
      },
    },
    {
      // sort pixel objects by position
      $sort: { position: 1 },
    },
    // { $limit: 6 },
  ]);
  res.json(pixels);
});

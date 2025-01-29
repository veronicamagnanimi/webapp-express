const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const upload = require("../middleware/upload");

//routes
router.get("/", movieController.index);
router.get("/:slug", movieController.show);
router.post("/:id/reviews", movieController.createReview);
router.post("/", upload.single("image"), movieController.store);

module.exports = router;
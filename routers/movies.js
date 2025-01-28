const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

//routes
router.get("/", movieController.index);
router.get("/:slug", movieController.show);
router.post("/:id/reviews", movieController.createReview);
// router.post("/", movieController.store);


module.exports = router;
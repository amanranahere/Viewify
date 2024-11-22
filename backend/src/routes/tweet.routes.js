import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
  getAllTweets,
} from "../controllers/tweet.controller.js";

const router = Router();
router.use(verifyJWT);

// routes
router
  .route("/")
  .get(getAllTweets)
  .post(
    upload.fields([
      {
        name: "tweetImage",
        maxCount: 1,
      },
    ]),
    createTweet
  );

router.route("/user/:userId").get(getUserTweets);

router.route("/tweet/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router;

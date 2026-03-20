import { Router } from "express";
import {
  createTopic,
  deleteTopic,
  getTopicById,
  listTopics,
  restoreTopic,
  updateTopic,
} from "../controllers/topicController.js";

const router = Router();

router.route("/").get(listTopics).post(createTopic);
router.route("/:id").get(getTopicById).put(updateTopic).delete(deleteTopic);
router.route("/:id/restore").post(restoreTopic);

export default router;

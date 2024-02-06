import * as healthCheckController from "../controllers/healthcheck-controller.js";
import express from "express";

const router = express.Router();

router.route("/").get(healthCheckController.healthCheck);
router.route("/").all(healthCheckController.methodCheck);

export default router;

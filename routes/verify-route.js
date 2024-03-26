import * as verifyController from "../controllers/verify-controller.js";
import express from "express";

const router = express.Router();

router.route("/").all(verifyController.verifyUser);

export default router;
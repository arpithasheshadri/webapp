import * as userController from "../controllers/user-controller.js";
import express from "express";

const router = express.Router();

router.route("/").post(userController.createUser);
router.route("/").all(userController.methodCheck);

export default router;

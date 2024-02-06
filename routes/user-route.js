import * as userController from "../controllers/user-controller.js";
import express from "express";

const router = express.Router();

router.route("/").post(userController.createUser);
router.route("/").all(userController.methodCheck);
router.route("/self").get(userController.getUser);
router.route("/self").put(userController.updateUser);
router.route("/self").all(userController.methodCheck);

export default router;

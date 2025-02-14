import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "../user/user.validation";
import { UserController } from "../user/user.controller";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser
);
router.post(
  "/signin",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);

export const AuthRoutes = router;

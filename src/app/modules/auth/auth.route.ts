import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "../user/user.validation";
import { UserController } from "../user/user.controller";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/register",
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser
);
router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);
router.put(
  "/profile",
  auth(USER_ROLE.admin, USER_ROLE.user),
  AuthController.updateProfile
);
router.get(
  "/profile",
  auth(USER_ROLE.admin, USER_ROLE.user),
  AuthController.getProfile
);


router.post(
  '/forgot-password',
  AuthController.forgotPassword
);

export const AuthRoutes = router;

import express from "express";
import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { TaskValidation } from "./task.validation";
import { TaskController } from "./task.controller";

const router = express.Router();

router.post(
  "",
  auth(USER_ROLE.user),
  validateRequest(TaskValidation.createTaskZodSchema),
  TaskController.createTask
);
router.get("", auth(USER_ROLE.user), TaskController.getTaskCreatedByUser);

router.get("/all", TaskController.getAllTasks);
router.get("/:id", TaskController.getSingleTask);

router.put("/:id", TaskController.updateTask);

router.delete("/:id", TaskController.deleteTask);

export const TaskRoutes = router;

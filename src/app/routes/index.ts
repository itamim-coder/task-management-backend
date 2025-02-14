import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";

import { UserRoutes } from "../modules/user/user.route";
import { TaskRoutes } from "../modules/task/task.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/task",
    route: TaskRoutes,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;

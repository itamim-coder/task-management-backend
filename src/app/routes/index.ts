import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";


import { TaskRoutes } from "../modules/task/task.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/task",
    route: TaskRoutes,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;

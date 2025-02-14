/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";

import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  // origin: ["http://localhost:5173", "https://rentify-one-delta.vercel.app"],

  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
// application routes
app.use("/api/v1", router);
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
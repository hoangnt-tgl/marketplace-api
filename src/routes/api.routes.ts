import express from "express";
import path from "path"; // use for static route

import userRouter from "./user.routes";
const APIRouter = express.Router();

APIRouter.use("/static", express.static(path.join(__dirname, "../../public")));
APIRouter.use("/users", userRouter);

export default APIRouter;

import express from "express";
import path from "path"; // use for static route

import userRouter from "./user.routes";
import collectionRouter from "./collection.routes";
import itemRouter from "./item.routes";

const APIRouter = express.Router();


APIRouter.use("/static", express.static(path.join(__dirname, "../../public")));
APIRouter.use("/users", userRouter);
APIRouter.use("/collection", collectionRouter);
APIRouter.use("/item", itemRouter);

export default APIRouter;

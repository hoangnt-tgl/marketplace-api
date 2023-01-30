import express from "express";
import path from "path"; // use for static route

import userRouter from "./user.routes";
import collectionRouter from "./collection.routes";
import itemRouter from "./item.routes";
import orderRouter from "./order.routes";
import testRouter from "./test.routes";
import interactionRouter from "./interaction.routes";

const APIRouter = express.Router();


APIRouter.use("/static", express.static(path.join(__dirname, "../../public")));
APIRouter.use("/users", userRouter);
APIRouter.use("/collection", collectionRouter);
APIRouter.use("/item", itemRouter);
APIRouter.use("/order", orderRouter);
APIRouter.use("/interaction", interactionRouter)


APIRouter.use("/test", testRouter);

export default APIRouter;

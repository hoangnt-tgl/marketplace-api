import express from "express";
import { getNotifyByUserController, updateNotifyByUserController } from "../controllers/notification.controllers";
import { checkUserExistMiddleware } from "../middlewares/checkUser.middlewares";

const notifyRouter = express.Router();

notifyRouter.get("/offer/userAddress/:userAddress", checkUserExistMiddleware, getNotifyByUserController);

notifyRouter.put("/userAddress/:userAddress", checkUserExistMiddleware, updateNotifyByUserController);

export default notifyRouter;

import express from "express";
import { checkIsAdmin, checkUserAuthen } from "../middlewares/checkUser.middlewares";
import { createEventController, getAllEventController } from "../controllers/event.controllers";
const eventRouter = express.Router();

eventRouter.post("/create", checkUserAuthen, checkIsAdmin, createEventController);
eventRouter.get("/get-all/chainId/:chainId", getAllEventController);
eventRouter.post("/predict/chainId/:chainId/eventId/:eventId");
export default eventRouter;

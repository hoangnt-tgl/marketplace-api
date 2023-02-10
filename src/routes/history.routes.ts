import express from "express";
import { getHistoryByItemId, getHistoryByUser } from "../controllers/history.controllers";
const historyRouter = express.Router();

historyRouter.get("/get-by-item/itemId/:itemId", getHistoryByItemId);
historyRouter.get("/get-by-user/userAddress/:userAddress", getHistoryByUser);

export default historyRouter;

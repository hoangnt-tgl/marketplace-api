import express from "express";
import { getHistoryByItemId } from "../controllers/history.controllers";
const historyRouter = express.Router();

historyRouter.get("/get-by-item/itemId/:itemId", getHistoryByItemId);

export default historyRouter;

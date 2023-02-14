import express from "express";
import { getHistoryByCollection, getHistoryByItemId, getHistoryByUser } from "../controllers/history.controllers";
const historyRouter = express.Router();

historyRouter.get("/get-by-item/itemId/:itemId", getHistoryByItemId);
historyRouter.get("/get-by-user/userAddress/:userAddress", getHistoryByUser);
historyRouter.get("/get-by-collection/collectionId/:collectionId", getHistoryByCollection);
export default historyRouter;

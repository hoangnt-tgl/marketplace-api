"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const history_controllers_1 = require("../controllers/history.controllers");
const historyRouter = express_1.default.Router();
historyRouter.get("/get-by-item/itemId/:itemId", history_controllers_1.getHistoryByItemId);
historyRouter.get("/get-by-user/userAddress/:userAddress", history_controllers_1.getHistoryByUser);
historyRouter.get("/get-by-collection/collectionId/:collectionId", history_controllers_1.getHistoryByCollection);
historyRouter.get("/changePrice", history_controllers_1.changePrice);
exports.default = historyRouter;

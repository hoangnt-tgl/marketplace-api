"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkItem_middleware_1 = require("../middlewares/checkItem.middleware");
const history_controllers_1 = require("../controllers/history.controllers");
const checkOther_middlewares_1 = require("../middlewares/checkOther.middlewares");
const checkCollection_middlewares_1 = require("../middlewares/checkCollection.middlewares");
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const historyRouter = express_1.default.Router();
/* ******************************************
 *				GET ROUTE					*
 ********************************************/
historyRouter.get("/itemId/:itemId/pageSize/:pageSize/page/:pageId", checkItem_middleware_1.checkItemExistMiddleware, checkOther_middlewares_1.checkPageIdMiddleware, history_controllers_1.getHistoryByItemInPageController);
historyRouter.get("/userAddress/:userAddress/pageSize/:pageSize/page/:pageId", checkUser_middlewares_1.checkUserExistMiddleware, checkOther_middlewares_1.checkPageIdMiddleware, history_controllers_1.getListHistoriesByUserAddressController);
historyRouter.get("/latest", history_controllers_1.getLatestTransactionController);
historyRouter.get("/collectionId/:collectionId/pageSize/:pageSize/page/:pageId", checkCollection_middlewares_1.checkCollectionExistMiddleware, checkOther_middlewares_1.checkPageIdMiddleware, history_controllers_1.getCollectionActivityController);
historyRouter.get("/chart/itemId/:itemId", checkItem_middleware_1.checkItemExistMiddleware, history_controllers_1.getItemPriceChartDataController);
exports.default = historyRouter;

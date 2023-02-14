"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const checkOther_middlewares_1 = require("../middlewares/checkOther.middlewares");
const order_controllers_1 = require("../controllers/order.controllers");
const orderRouter = express_1.default.Router();
orderRouter.post("/sell-item/userAddress/:userAddress/chainId/:chainId", checkUser_middlewares_1.checkUserExist, checkOther_middlewares_1.checkChainIdValid, order_controllers_1.sellItem);
orderRouter.post("/buy-item/userAddress/:userAddress/chainId/:chainId", checkUser_middlewares_1.checkUserExist, checkOther_middlewares_1.checkChainIdValid, order_controllers_1.buyItem);
orderRouter.post("/cancel-order/userAddress/:userAddress/chainId/:chainId", checkUser_middlewares_1.checkUserExist, checkOther_middlewares_1.checkChainIdValid, order_controllers_1.cancelOrder);
orderRouter.get("/get-order-sell", order_controllers_1.getOrderSellItem);
exports.default = orderRouter;

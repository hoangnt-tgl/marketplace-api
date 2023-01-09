"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const checkOther_middlewares_1 = require("../middlewares/checkOther.middlewares");
const checkOrder_middlewares_1 = require("../middlewares/checkOrder.middlewares");
const checkItem_middleware_1 = require("../middlewares/checkItem.middleware");
const orderRouter = express_1.default.Router();
/* ******************************************
 *				POST ROUTE					*
 ********************************************/
//GET TOKEN LIST BY CHAINID
orderRouter.get("/listToken", checkOther_middlewares_1.checkChainIdMiddleware, order_controller_1.getListToken);
//FILTER ORDER
orderRouter.post("/query", order_controller_1.getOrderQueryController);
orderRouter.get("/detail/orderId/:orderId", checkOrder_middlewares_1.checkOrderMiddleware, order_controller_1.getOrderDetailController);
orderRouter.get("/itemId/:itemId", checkItem_middleware_1.checkItemExistMiddleware, order_controller_1.getOrderByItemController);
//DELETE ORDER
orderRouter.post("/delete", checkOrder_middlewares_1.checkOrderMiddleware, order_controller_1.deleteOrderByItemIdController);
exports.default = orderRouter;

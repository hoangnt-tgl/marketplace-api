"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sell_controllers_1 = require("../controllers/sell.controllers");
const checkItem_middleware_1 = require("../middlewares/checkItem.middleware");
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const checkOther_middlewares_1 = require("../middlewares/checkOther.middlewares");
const sellRouter = express_1.default.Router();
/* ******************************************
 *			      	POST ROUTE					        *
 ********************************************/
sellRouter.post("/create", checkUser_middlewares_1.checkUserMatchOnBlockchain, checkOther_middlewares_1.checkChainIdMiddleware, checkUser_middlewares_1.checkUserExistMiddleware, checkItem_middleware_1.checkOwnerItemMiddleware, checkItem_middleware_1.checkItemExistMiddleware, 
// checkItemSelling,
sell_controllers_1.createSellController);
exports.default = sellRouter;

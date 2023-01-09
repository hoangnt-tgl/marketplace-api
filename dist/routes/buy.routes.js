"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const buy_controllers_1 = require("../controllers/buy.controllers");
const checkOther_middlewares_1 = require("../middlewares/checkOther.middlewares");
const checkItem_middleware_1 = require("../middlewares/checkItem.middleware");
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const buyRouter = express_1.default.Router();
/* ******************************************
 *				  POST ROUTE					            *
 ********************************************/
buyRouter.post("/create", checkUser_middlewares_1.checkUserMatchOnBlockchain, checkOther_middlewares_1.checkChainIdMiddleware, checkUser_middlewares_1.checkUserExistMiddleware, checkItem_middleware_1.checkItemExistMiddleware, buy_controllers_1.createBuyController);
exports.default = buyRouter;

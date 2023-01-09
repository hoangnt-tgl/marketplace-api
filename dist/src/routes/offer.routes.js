"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const offer_controller_1 = require("../controllers/offer.controller");
const checkOther_middlewares_1 = require("../middlewares/checkOther.middlewares");
const checkItem_middleware_1 = require("../middlewares/checkItem.middleware");
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const offer_controller_2 = require("../controllers/offer.controller");
const checkOrder_middlewares_1 = require("../middlewares/checkOrder.middlewares");
const offerRouter = express_1.default.Router();
/* ******************************************
 *				GET ROUTE					*
 ********************************************/
offerRouter.get('/user/orderId/:orderId', checkOrder_middlewares_1.checkOrderMiddleware, offer_controller_2.getOfferByUserController);
offerRouter.get("/item/orderId/:orderId", checkOrder_middlewares_1.checkOrderMiddleware, offer_controller_2.getOfferByItemController);
offerRouter.get('/detail/orderId/:orderId', checkOrder_middlewares_1.checkOrderMiddleware, offer_controller_2.getOfferDetailController);
offerRouter.get('/userAddress/:userAddress/itemId/:itemId', checkUser_middlewares_1.checkUserExistMiddleware, checkItem_middleware_1.checkItemExistMiddleware, offer_controller_1.queryOneOfferController);
/* ******************************************
 *				POST ROUTE					*
 ********************************************/
offerRouter.post('/query', offer_controller_2.queryOfferController);
offerRouter.put('/orderId/:orderId', checkOther_middlewares_1.checkChainIdMiddleware, checkOrder_middlewares_1.checkOrderMiddleware, checkItem_middleware_1.checkItemExistMiddleware, checkUser_middlewares_1.checkUserExistMiddleware, checkItem_middleware_1.checkOwnerItemMiddleware, checkItem_middleware_1.checkItemSelling, offer_controller_2.updateOfferController);
exports.default = offerRouter;

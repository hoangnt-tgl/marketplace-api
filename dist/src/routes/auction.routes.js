"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuction_middlewares_1 = require("../middlewares/checkAuction.middlewares");
const auction_controllers_1 = require("../controllers/auction.controllers");
const checkCollection_middlewares_1 = require("../middlewares/checkCollection.middlewares");
const checkOther_middlewares_1 = require("../middlewares/checkOther.middlewares");
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const auctionRouter = express_1.default.Router();
/* ******************************************
 *				GET ROUTE					*
 ********************************************/
auctionRouter.get("/auctionId/:auctionId", checkAuction_middlewares_1.updateAuctionStatusMiddleware, checkAuction_middlewares_1.checkAuctionExistMiddleware, auction_controllers_1.getAuctionByIdController);
auctionRouter.post("/pageSize/:pageSize/page/:pageId", checkAuction_middlewares_1.updateAuctionStatusMiddleware, checkOther_middlewares_1.checkPageIdMiddleware, auction_controllers_1.queryAuctionController);
auctionRouter.get("/top/limit/:limit", checkAuction_middlewares_1.updateAuctionStatusMiddleware, auction_controllers_1.getTopBidController);
auctionRouter.get("/bidder/auctionId/:auctionId", checkAuction_middlewares_1.checkAuctionExistMiddleware, auction_controllers_1.getListBidderController);
/* ******************************************
 *				POST ROUTE					*
 ********************************************/
auctionRouter.post("/create", checkOther_middlewares_1.checkChainIdMiddleware, checkUser_middlewares_1.checkUserExistMiddleware, checkCollection_middlewares_1.checkCollectionExistMiddleware, checkAuction_middlewares_1.checkListItemAuctionMiddleware, checkAuction_middlewares_1.checkPaymentTokenMiddleware, checkAuction_middlewares_1.checkCreateAuctionMiddleware, auction_controllers_1.createAuctionController);
auctionRouter.post("/settle/auctionId/:auctionId", checkAuction_middlewares_1.updateAuctionStatusMiddleware, checkAuction_middlewares_1.checkAuctionExistMiddleware, checkAuction_middlewares_1.checkAuctionSettleMiddleware, auction_controllers_1.settleAuctionController);
exports.default = auctionRouter;

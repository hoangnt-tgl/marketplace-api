"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuction_middlewares_1 = require("../middlewares/checkAuction.middlewares");
const auction_controllers_1 = require("../controllers/auction.controllers");
const checkOther_middlewares_1 = require("../middlewares/checkOther.middlewares");
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const auctionRouter = express_1.default.Router();
/* ******************************************
 *				GET ROUTE					*
 ********************************************/
auctionRouter.get("/auctionId/:auctionId", checkAuction_middlewares_1.updateAuctionStatusMiddleware, checkAuction_middlewares_1.checkAuctionExistMiddleware, auction_controllers_1.getAuctionByIdController);
auctionRouter.get("/top/limit/:limit", checkAuction_middlewares_1.updateAuctionStatusMiddleware, auction_controllers_1.getTopBidController);
auctionRouter.get("/bidder/auctionId/:auctionId", checkAuction_middlewares_1.checkAuctionExistMiddleware, auction_controllers_1.getListBidderController);
/* ******************************************
 *				POST ROUTE					*
 ********************************************/
auctionRouter.post("/create", 
//checkINOExistMiddleware,
checkAuction_middlewares_1.checkListItemAuctionMiddleware, 
//checkCreateAuctionMiddleware,
auction_controllers_1.createAuctionController);
auctionRouter.post("/settle/auctionId/:auctionId", checkAuction_middlewares_1.checkAuctionExistMiddleware, checkUser_middlewares_1.checkUserExistMiddleware, auction_controllers_1.settleAuctionController);
auctionRouter.post("/bid/auctionId/:auctionId", checkAuction_middlewares_1.checkAuctionExistMiddleware, checkUser_middlewares_1.checkUserExistMiddleware, auction_controllers_1.makeBidController);
auctionRouter.post("/pageSize/:pageSize/page/:pageId", checkAuction_middlewares_1.updateAuctionStatusMiddleware, checkOther_middlewares_1.checkPageIdMiddleware, auction_controllers_1.queryAuctionController);
auctionRouter.post("/participate", checkAuction_middlewares_1.checkAuctionExistMiddleware, checkUser_middlewares_1.checkUserExistMiddleware, auction_controllers_1.auctionParticipateController);
exports.default = auctionRouter;

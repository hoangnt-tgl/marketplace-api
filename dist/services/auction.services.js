"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManyAuctionService = exports.updateAuctionStatusService = exports.checkItemIsAuctionService = exports.getTopBidService = exports.queryAuctionService = exports.checkAuctionExistService = exports.makeBidService = exports.settleAuctionService = exports.createAuctionService = void 0;
const makeBid_model_1 = __importDefault(require("../models/makeBid.model"));
const auction_model_1 = __importDefault(require("../models/auction.model"));
const model_services_1 = require("./model.services");
// import { changePriceService, fromWeiToTokenService, getTokenService } from "./price.services";
const other_services_1 = require("./other.services");
const createAuctionService = (chainId, inoId, collectionId, items, minPrice, bidIncreasePercent, paymentToken, seller, endTime, startTime) => __awaiter(void 0, void 0, void 0, function* () {
    const arrObjItemId = [];
    items.map((item) => {
        arrObjItemId.push((0, model_services_1.createObjIdService)(item));
    });
    const isLive = startTime <= Date.now() ? true : false;
    const obj = {
        chainId,
        collectionId,
        listItemId: arrObjItemId,
        minPrice,
        bidIncreasePercent,
        paymentToken,
        seller,
        isLive,
        startTime,
        endTime,
        refINO: inoId,
    };
    const auction = yield (0, model_services_1.createService)(auction_model_1.default, obj);
    return auction;
});
exports.createAuctionService = createAuctionService;
const settleAuctionService = (auctionId) => __awaiter(void 0, void 0, void 0, function* () {
    const auction = yield (0, model_services_1.deleteOneService)(auction_model_1.default, { _id: auctionId });
    return auction;
});
exports.settleAuctionService = settleAuctionService;
const queryAuctionService = (textSearch = "", chainId, userAddress, status, pageId, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
    const queryStatus = status === "live"
        ? { isLive: true }
        : status === "nerver coming"
            ? { isLive: false, startTime: { $gt: Math.floor(Date.now() / 1000) } }
            : status === "completed"
                ? { isLive: false, endTime: { $lte: Math.floor(Date.now() / 1000) } }
                : {};
    const queryObj = (0, other_services_1.removeUndefinedOfObj)(Object.assign(Object.assign({}, queryStatus), { chainId: chainId && chainId.length > 0 ? chainId : undefined, participant: userAddress ? userAddress : undefined }));
    const inoObj = (0, other_services_1.removeUndefinedOfObj)({
        path: "infoINO",
        match: textSearch ? { nameINO: { $regex: textSearch, $options: "i" }, typeINO: 1 } : undefined,
    });
    const auctions = yield auction_model_1.default.find(queryObj, "_id refINO").populate(inoObj).lean();
    const data = auctions.reduce((arr, cur) => {
        if (cur.infoINO !== null) {
            arr.push({
                _id: cur._id.toString(),
            });
        }
        return arr;
    }, []);
    const response = (0, other_services_1.paginateArrayService)(data, pageSize, pageId);
    return response;
});
exports.queryAuctionService = queryAuctionService;
const makeBidService = (userAddress, auctionId, bidAmount, paymentToken, transactionHash) => __awaiter(void 0, void 0, void 0, function* () {
    let newBid = {
        auctionId,
        bidAmount,
        userAddress,
        paymentToken,
        transactionHash,
    };
    return yield (0, model_services_1.createService)(makeBid_model_1.default, newBid);
});
exports.makeBidService = makeBidService;
const checkAuctionExistService = (auctionId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, model_services_1.queryExistService)(auction_model_1.default, { _id: (0, model_services_1.createObjIdService)(auctionId) });
});
exports.checkAuctionExistService = checkAuctionExistService;
// const getOneAuctionService = async (queryObj: any) => {
// 	const auction: Auction = await auctionModel
// 		.findOne(queryObj)
// 		.lean()
// 		.populate({
// 			path: "items",
// 			select: "itemTokenId itemName itemMedia owner creator",
// 			populate: { path: "ownerInfo creatorInfo", select: "userAddress avatar username" },
// 		})
// 		.populate({ path: "infoINO", select: "addressINO ownerINO nameINO descriptionINO typeINO" })
// 		.populate({ path: "collectionInfo", select: "collectionAddress" });
// 	return auction;
// };
// const auctionParticipateService = async (
// 	auctionId: string,
// 	userAddress: string,
// 	isJoin: boolean = true,
// 	bidAmount: number,
// ) => {
// 	let result: Auction;
// 	if (isJoin) {
// 		let AuctionInfo = await auctionModel.findOne({ _id: createObjIdService(auctionId) });
// 		if (bidAmount > AuctionInfo.highestBid) {
// 			result = await updateOneService(
// 				auctionModel,
// 				{ _id: createObjIdService(auctionId) },
// 				{
// 					highestBid: bidAmount,
// 					highestBidder: userAddress.toLowerCase(),
// 					$addToSet: { participant: userAddress.toLowerCase() },
// 				},
// 			);
// 		} else {
// 			result = await updateOneService(
// 				auctionModel,
// 				{ _id: createObjIdService(auctionId) },
// 				{ $addToSet: { participant: userAddress.toLowerCase() } },
// 			);
// 		}
// 	} else {
// 		result = await updateOneService(
// 			auctionModel,
// 			{ _id: createObjIdService(auctionId) },
// 			{ $pull: { participant: userAddress.toLowerCase() } },
// 		);
// 	}
// 	return result;
// };
const getManyAuctionService = (objQuery, properties = "") => __awaiter(void 0, void 0, void 0, function* () {
    const auctions = yield (0, model_services_1.findManyService)(auction_model_1.default, objQuery, properties);
    return auctions;
});
exports.getManyAuctionService = getManyAuctionService;
// const getAuctionByIdService = async (auctionId: string, userAddress: any) => {
// 	const auction: Auction = await getOneAuctionService({ _id: createObjIdService(auctionId) });
// 	auction.isParticipate =
// 		typeof userAddress === "string" && auction.participant.includes(userAddress.toLowerCase()) ? true : false;
// 	const extraAuction: ExtraAuctionInfo = await returnAdditionalAuctionService(auction);
// 	return extraAuction;
// };
const getTopBidService = (limit) => __awaiter(void 0, void 0, void 0, function* () {
    const bids = yield (0, model_services_1.findManyService)(makeBid_model_1.default, {});
    const bidToAuction = bids.reduce((obj, cur) => {
        if (!obj[cur.auctionId]) {
            obj[cur.auctionId] = 1;
        }
        else {
            obj[cur.auctionId] += 1;
        }
        return obj;
    }, {});
    const idArr = Object.keys(bidToAuction);
    const topAuction = [];
    let limitAuction = idArr.length < limit ? idArr.length : limit;
    for (let i = 0; i < limitAuction; i++) {
        topAuction.push({
            auctionId: idArr[i],
            bidAmount: bidToAuction[idArr[i]],
        });
    }
    topAuction.sort((a, b) => {
        return b.bidAmount - a.bidAmount;
    });
    return topAuction;
});
exports.getTopBidService = getTopBidService;
const checkItemIsAuctionService = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const check = yield (0, model_services_1.findOneService)(auction_model_1.default, { listItemId: (0, model_services_1.createObjIdService)(itemId) }, "_id");
    return check ? true : false;
});
exports.checkItemIsAuctionService = checkItemIsAuctionService;
const updateAuctionStatusService = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = Math.floor(Date.now() / 1000);
    yield (0, model_services_1.updateManyService)(auction_model_1.default, { endTime: { $lte: now } }, { isLive: false });
});
exports.updateAuctionStatusService = updateAuctionStatusService;

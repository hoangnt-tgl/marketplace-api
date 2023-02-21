import makeBidModel from "../models/makeBid.model";
import auctionModel from "../models/auction.model";
import { getAmountBidService } from "./makeBid.services";
import {
	createObjIdService,
	createService,
	deleteOneService,
	findManyService,
	findOneService,
	queryExistService,
	updateManyService,
	updateOneService,
} from "./model.services";
// import { changePriceService, fromWeiToTokenService, getTokenService } from "./price.services";
import { multiProcessService, paginateArrayService, removeUndefinedOfObj } from "./other.services";
import { ChainId } from "../interfaces/other.interfaces";
import { Types } from "mongoose";
import { Auction, ExtraAuctionInfo } from "../interfaces/INO.interfaces";
import { ListResponseAPI, MongooseObjectId } from "../interfaces/responseData.interfaces";

const createAuctionService = async (
	chainId: ChainId,
	inoId: Types.ObjectId,
	collectionId: Types.ObjectId,
	items: string[],
	minPrice: string,
	bidIncreasePercent: number,
	paymentToken: string,
	seller: string,
	endTime: number,
	startTime: number,
): Promise<Auction> => {
	const arrObjItemId: Types.ObjectId[] = [];
	items.map((item: string) => {
		arrObjItemId.push(createObjIdService(item));
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
	const auction: Auction = await createService(auctionModel, obj);

	return auction;
};

const settleAuctionService = async (auctionId: Types.ObjectId) => {
	const auction: Auction = await deleteOneService(auctionModel, { _id: auctionId });
	return auction;
};

const queryAuctionService = async (
	textSearch: string = "",
	chainId: ChainId[],
	userAddress: string,
	status: string,
	pageId: number,
	pageSize: number,
) => {
	const queryStatus =
		status === "live"
			? { isLive: true }
			: status === "nerver coming"
			? { isLive: false, startTime: { $gt: Math.floor(Date.now() / 1000) } }
			: status === "completed"
			? { isLive: false, endTime: { $lte: Math.floor(Date.now() / 1000) } }
			: {};

	const queryObj = removeUndefinedOfObj({
		...queryStatus,
		chainId: chainId && chainId.length > 0 ? chainId : undefined,
		participant: userAddress ? userAddress : undefined,
	});

	const inoObj = removeUndefinedOfObj({
		path: "infoINO",
		match: textSearch ? { nameINO: { $regex: textSearch, $options: "i" }, typeINO: 1 } : undefined,
	});

	const auctions: any[] = await auctionModel.find(queryObj, "_id refINO").populate(inoObj).lean();

	const data: MongooseObjectId[] = auctions.reduce((arr: MongooseObjectId[], cur: Auction) => {
		if (cur.infoINO !== null) {
			arr.push({
				_id: cur._id.toString(),
			});
		}
		return arr;
	}, []);

	const response: ListResponseAPI<MongooseObjectId> = paginateArrayService(data, pageSize, pageId);

	return response;
};

const makeBidService = async (userAddress: string, auctionId: string, bidAmount: number, paymentToken: string, transactionHash: string) => {
	let newBid = {
		auctionId,
		bidAmount,
		userAddress,
		paymentToken,
		transactionHash,
	}
	return await createService(makeBidModel, newBid);
};

const checkAuctionExistService = async (auctionId: string) => {
	return await queryExistService(auctionModel, { _id: createObjIdService(auctionId) });
};

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

const getManyAuctionService = async (objQuery: any, properties = "") => {
	const auctions: Auction[] = await findManyService(auctionModel, objQuery, properties);
	return auctions;
};

// const getAuctionByIdService = async (auctionId: string, userAddress: any) => {
// 	const auction: Auction = await getOneAuctionService({ _id: createObjIdService(auctionId) });
// 	auction.isParticipate =
// 		typeof userAddress === "string" && auction.participant.includes(userAddress.toLowerCase()) ? true : false;
// 	const extraAuction: ExtraAuctionInfo = await returnAdditionalAuctionService(auction);
// 	return extraAuction;
// };

const getTopBidService = async (limit: number) => {
	const bids = await findManyService(makeBidModel, {});

	const bidToAuction = bids.reduce((obj: any, cur: any) => {
		if (!obj[cur.auctionId]) {
			obj[cur.auctionId] = 1;
		} else {
			obj[cur.auctionId] += 1;
		}
		return obj;
	}, {});

	const idArr = Object.keys(bidToAuction);
	const topAuction: any = [];

	let limitAuction = idArr.length < limit ? idArr.length : limit;

	for (let i = 0; i < limitAuction; i++) {
		topAuction.push({
			auctionId: idArr[i],
			bidAmount: bidToAuction[idArr[i]],
		});
	}

	topAuction.sort((a: any, b: any) => {
		return b.bidAmount - a.bidAmount;
	});

	return topAuction;
};

const checkItemIsAuctionService = async (itemId: string) => {
	const check = await findOneService(auctionModel, { listItemId: createObjIdService(itemId) }, "_id");
	return check ? true : false;
};

const updateAuctionStatusService = async () => {
	const now = Math.floor(Date.now() / 1000);
	await updateManyService(auctionModel, { endTime: { $lte: now } }, { isLive: false });
};

// const returnAdditionalAuctionService = async (auction: Auction) => {
// 	const token = await getTokenService({ chainId: auction.chainId, tokenAddress: auction.paymentToken });

// 	const getTokenPrice = (key: string, weiPrice: string, decimal: number) => {
// 		const obj: any = {};
// 		const result = fromWeiToTokenService(weiPrice, decimal);
// 		obj[key] = result;
// 		return obj;
// 	};

// 	const getUsdPrice = async (key: string, token: string, weiPrice: string) => {
// 		const obj: any = {};
// 		const result = await changePriceService(token, "usd", weiPrice);
// 		obj[key] = result;
// 		return obj;
// 	};

// 	const getAmountOfBid = async () => {
// 		const result = await getAmountBidService(auction._id.toString());
// 		return {
// 			amountBidder: result,
// 		};
// 	};
// 	const obj = await multiProcessService([
// 		getTokenPrice("minPriceToken", auction.minPrice, token.decimal),
// 		getTokenPrice("highestBidToken", auction.highestBid, token.decimal),
// 		getUsdPrice("minPriceUsd", token.tokenSymbol, auction.minPrice),
// 		getUsdPrice("highestBidUsd", token.tokenSymbol, auction.highestBid),
// 		getAmountOfBid(),
// 	]);
// 	const extraAuction: ExtraAuctionInfo = {
// 		...auction,
// 		minPrice: obj.minPriceToken,
// 		highestBid: obj.highestBidToken,
// 		minPriceUsd: obj.minPriceUsd,
// 		highestBidUsd: obj.highestBidUsd,
// 		amountBidder: obj.amountBidder,
// 		priceType: token.tokenSymbol,
// 		status:
// 			auction.isLive === true
// 				? "live"
// 				: auction.isLive === false && auction.startTime > Math.floor(Date.now() / 1000)
// 				? "upcoming"
// 				: auction.isLive === false && auction.endTime <= Math.floor(Date.now() / 1000)
// 				? "completed"
// 				: "",
// 	};
// 	return extraAuction;
// };

export {
	createAuctionService,
	settleAuctionService,
	makeBidService,
	checkAuctionExistService,
	// getOneAuctionService,
	queryAuctionService,
	getTopBidService,
	checkItemIsAuctionService,
	updateAuctionStatusService,
	getManyAuctionService,
	// getAuctionByIdService,
	// auctionParticipateService,
};

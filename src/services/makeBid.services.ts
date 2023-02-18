import { Token } from "../interfaces/token.interfaces";
// import { ExtraMakeBid, MakeBid } from "../interfaces/INO.interfaces";
import makeBidModel from "../models/makeBid.model";
import { countByQueryService, createObjIdService, createService, deleteManyService, findManyService, updateOneService } from "./model.services";
// import { fromWeiToTokenService, getTokenService } from "./price.services";
import auctionModel from "../models/auction.model";
import { Types } from "mongoose";

const createBidService = async (
	auctionId: string,
	userAddress: string,
	bidAmount: string,
	paymentToken: string,
	transactionHash: string,
) => {
	const newBid = {
		auctionId: createObjIdService(auctionId),
		userAddress,
		bidAmount,
		paymentToken,
		transactionHash,
	};
	await updateOneService(auctionModel, { _id: auctionId }, { $addToSet: { participant: userAddress.toLowerCase() } });
	const bid = await createService(makeBidModel, newBid);
	return bid;
};

const getTopBidOfAuction = async (auctionId: string) => {
	// const bids: MakeBid[] = await findManyService(makeBidModel, { auctionId: createObjIdService(auctionId) }, "", {
	// 	bidAmount: -1,
	// });
	// return bids[0];
};

const getAmountBidService = async (auctionId: string) => {
	const amount = await countByQueryService(makeBidModel, { auctionId: createObjIdService(auctionId) });
	return amount;
};

const getListBidderService = async (auctionId: string) => {
	// const biders: MakeBid[] = await makeBidModel
	// 	.find({ auctionId: createObjIdService(auctionId) })
	// 	.sort({ createdAt: -1 })
	// 	.lean()
	// 	.populate({ path: "userInfo", select: "username avatar" });
	// const extraBidders: ExtraMakeBid[] = [];
	// if (biders.length > 0) {
	// 	const token: Token = await getTokenService({ tokenAddress: biders[0].paymentToken });
	// 	for (let i = 0; i < biders.length; i++) {
	// 		const extraBidder: ExtraMakeBid = {
	// 			...biders[i],
	// 			tokenAmount: fromWeiToTokenService(biders[i].bidAmount, token.decimal),
	// 			priceType: token.tokenSymbol,
	// 		};
	// 		extraBidders.push(extraBidder);
	// 	}
	// }
	// return extraBidders;
};

const deleteBidService = async (auctionId: Types.ObjectId) => {
	const result = await deleteManyService(makeBidModel, { auctionId });
	return result;
}

export { createBidService, deleteBidService, getAmountBidService, getTopBidOfAuction, getListBidderService };

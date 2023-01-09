import orderModel from "../models/Order.model";
import { createObjIdService, findOneService } from "../services/model.services";
import { changePriceService, fromWeiToTokenService, getTokenService } from "./price.services";
import { ExtraOfferInfo, Order } from "../interfaces/order.interfaces";
import { DEFAULT_CHAIN_ID } from "../constant/default.constant";
import { removeUndefinedOfObj } from "./other.services";
import { ChainId } from "../interfaces/other.interfaces";
import { off } from "process";

const queryOfferService = async (
	chainId: ChainId[],
	maker: string,
	taker: string,
	itemId: string,
	asc: number,
): Promise<ExtraOfferInfo[]> => {
	const objQuery = removeUndefinedOfObj({
		chainId: chainId && chainId.length ? chainId : undefined,
		maker,
		taker,
		itemId,
	});
	const offers: Order[] = await orderModel
		.find(removeUndefinedOfObj({ ...objQuery, type: 1, isDeleted: false }))
		.lean()
		.populate({ path: "itemInfo", select: "itemName itemMedia" });
	console.log(offers);
	const orderOffers: ExtraOfferInfo[] = [];
	await Promise.all(
		offers.map(async (offer: Order) => {
			orderOffers.push(await returnExtraInfoOfferService(chainId,offer));
		}),
	);
	return asc === 1
		? orderOffers.sort((a: any, b: any) => a.createdAt - b.createdAt)
		: orderOffers.sort((a: any, b: any) => b.createdAt - a.createdAt);
};

const returnExtraInfoOfferService = async (chainId:any,offer: Order, isQueryByUser: boolean = true): Promise<ExtraOfferInfo> => {
	const token = await getTokenService({
		chainId: chainId,
		tokenAddress: offer.paymentToken.toLowerCase(),
	});
	console.log(token);
	let usdPrice: number;
	await Promise.all([(usdPrice = await changePriceService(token.tokenSymbol, "usd", offer?.basePrice))]);
	const extraOffer: ExtraOfferInfo = {
		...offer,
		priceLogo: token.logoURI,
		offerPrice: fromWeiToTokenService(offer.basePrice, token.decimal),
		usdPrice: usdPrice,
		tokenSymbol: token.tokenSymbol,
	};
	return extraOffer;
};

const getOfferDetailService = async (orderId: string): Promise<Order> => {
	let offer = await findOneService(orderModel, { _id: createObjIdService(orderId), type: 1, isDeleted: false });
	await returnExtraInfoOfferService(DEFAULT_CHAIN_ID,offer);
	return offer;
};

export { queryOfferService, getOfferDetailService };

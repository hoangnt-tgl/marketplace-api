import { Types } from "mongoose";
import { ExtraOrderInfo, Order } from "../interfaces/order.interfaces";
import itemModel from "../models/item.model";
import orderModel from "../models/Order.model";
import { changePriceService, fromWeiToTokenService } from "../services/price.services";
import { createObjIdService, createService, findManyService, findOneService, updateOneService } from "./model.services";
import { getManyTokenService, getTokenService } from "./price.services";
import { ReturnToken, Token } from "../interfaces/token.interfaces";
import { ChainId } from "../interfaces/other.interfaces";
import { MongooseObjectId } from "../interfaces/responseData.interfaces";

const createOrderService = async (
	chainId: ChainId,
	maker: string,
	taker: string,
	makerRelayerFee: string,
	takerRelayerFee: string,
	feeRecipient: string,
	side: number,
	saleKind: number,
	target: string,
	itemId: string,
	howToCall: number,
	callData: string,
	replacementPattern: string,
	staticTarget: string,
	staticExtraData: string,
	paymentToken: string,
	basePrice: string,
	extra: string,
	listingTime: number,
	expirationTime: number,
	salt: string,
	feeMethod: number,
	makerProtocolFee: string,
	takerProtocolFee: string,
	r: string,
	s: string,
	v: string,
	type: number,
	quantity: number,
): Promise<Order> => {
	const newOrder = {
		chainId,
		maker,
		taker,
		makerRelayerFee,
		takerRelayerFee,
		feeRecipient,
		side,
		saleKind,
		target,
		itemId: createObjIdService(itemId),
		howToCall,
		callData,
		replacementPattern,
		staticTarget,
		staticExtraData,
		paymentToken,
		basePrice,
		extra,
		listingTime,
		expirationTime,
		salt,
		feeMethod,
		makerProtocolFee,
		takerProtocolFee,
		r,
		s,
		v,
		type,
		quantity,
	};

	const order: Order = await createService(orderModel, newOrder);
	return order;
};

const getOrderDetailService = async (orderId: string): Promise<ExtraOrderInfo> => {
	const order: Order = await findOneService(orderModel, { _id: createObjIdService(orderId) });
	const extraOrder: ExtraOrderInfo = await returnAdditionalInfoOfOrderService(order);
	return extraOrder;
};

const deleteOrderByItemIdService = async (_id: Types.ObjectId): Promise<Order> => {
	const order: Order = await updateOneService(orderModel, { _id, isDeleted: false }, { isDeleted: true });
	await updateOneService(itemModel, { _id: order.itemId }, { status: 0 });
	return order;
};

const getListTokenService = async (chainId: ChainId): Promise<ReturnToken[]> => {
	const tokens: Token[] = await getManyTokenService({ chainId });
	const listTokens: ReturnToken[] = [];
	tokens.map((token: Token) => {
		listTokens.push({
			chainId: token.chainId,
			name: token.tokenName,
			address: token.tokenAddress,
			symbol: token.tokenSymbol.toUpperCase(),
			logoURI: token.logoURI,
		});
	});
	return listTokens;
};

const getOneOrderService = async (objQuery: any): Promise<ExtraOrderInfo> => {
	const order: Order = await findOneService(orderModel, {
		maker: objQuery.userAddress,
		itemId: createObjIdService(objQuery.itemId),
		type: Number(objQuery.type),
		isDeleted: false,
	});
	let extraOrder!: ExtraOrderInfo;
	if (order) {
		extraOrder = await returnAdditionalInfoOfOrderService(order);
	}
	return extraOrder;
};

const getManyOrderService = async (objQuery: any): Promise<MongooseObjectId[]> => {
	const orders: MongooseObjectId[] = await findManyService(
		orderModel,
		{ ...objQuery, type: 0, isDeleted: false },
		"_id",
	);
	return orders;
};

const getListingPriceItemService = async (itemId: string): Promise<number> => {
	const orders: Order[] = await findManyService(orderModel, {
		itemId: createObjIdService(itemId),
		type: 0,
		isDelete: false,
	});
	let listingPrice: number = 0;
	if (orders.length > 0) {
		for (let i = 0; i < orders.length; i++) {
			const token: Token = await getTokenService({ tokenAddress: orders[i].paymentToken });
			const orderPrice: number = await changePriceService(token.tokenName, "usd", orders[i].basePrice);
			listingPrice += orderPrice / orders[i].quantity;
		}
		listingPrice /= orders.length;
	}
	return listingPrice;
};

const returnAdditionalInfoOfOrderService = async (order: Order): Promise<ExtraOrderInfo> => {
	const token: Token = await getTokenService({
		chainId: order.chainId,
		tokenAddress: order.paymentToken.toLowerCase(),
	});
	let usdPrice: number;
	await Promise.all([(usdPrice = await changePriceService(token.tokenSymbol, "usd", order?.basePrice))]);
	const extraOrder: ExtraOrderInfo = {
		...order,
		salePrice: fromWeiToTokenService(order?.basePrice, token.decimal),
		tokenSymbol: token.tokenSymbol,
		usdPrice: usdPrice,
	};
	return extraOrder;
};

export {
	createOrderService,
	deleteOrderByItemIdService,
	getListTokenService,
	getOneOrderService,
	getOrderDetailService,
	getListingPriceItemService,
	getManyOrderService,
};

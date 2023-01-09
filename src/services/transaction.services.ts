import { MetaSpacecyExchange } from "../constant/contract.constant";
import { Order } from "../interfaces/order.interfaces";
import { ChainId } from "../interfaces/other.interfaces";
import { Token } from "../interfaces/token.interfaces";
import collectionModel from "../models/collection.model";
import itemModel from "../models/item.model";
import orderModel from "../models/Order.model";
import { updateVolumeTradedService } from "./collection.services";
import { createHistoryService } from "./history.services";
import {
	checkItemOfferStatusService,
	checkItemStatusService,
	updateOwnerItemService,
	updatePriceItemService,
	updateStatusItemService,
} from "./item.services";
import { createObjIdService, deleteOneService, findOneService } from "./model.services";
import { createOrderService } from "./Order.services";
import { changePriceService, getTokenService } from "./price.services";

const sellTransactionService = async (
	chainId: ChainId,
	feeMethod: number,
	maker: string,
	taker: string,
	makerRelayerFee: string,
	takerRelayerFee: string,
	feeRecipient: string,
	side: number,
	saleKind: number,
	target: string,
	itemId: string,
	collectionId: string,
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
	r: string,
	s: string,
	v: string,
	makerProtocolFee: string,
	takerProtocolFee: string,
	type: number,
	quantity: number,
): Promise<Order> => {
	const orderSell = await createOrderService(
		chainId,
		maker,
		taker,
		makerRelayerFee,
		takerRelayerFee,
		feeRecipient,
		side,
		saleKind,
		target,
		itemId,
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
	);
	const token: Token = await getTokenService({ chainId : chainId, tokenAddress: paymentToken });
	const symbolToken: string = token.tokenSymbol;
	const item = await findOneService(itemModel, { _id: itemId });
	const collection = await findOneService(collectionModel, { _id: collectionId });

	if (orderSell) {
		await Promise.all(
			[
				updateStatusItemService(createObjIdService(itemId), { status: 1 }),
				updatePriceItemService(itemId,{priceType:symbolToken}),
				updatePriceItemService(itemId,{price: basePrice}),
				createHistoryService(
					collection._id,
					item._id,
					maker,
					MetaSpacecyExchange[chainId],
					basePrice,
					symbolToken,
					quantity,
					"",
					6,
				),
			].map(async (func: any) => {
				await func;
			}),
		);
	}
	return orderSell;
};

const offerTransactionService = async (
	chainId: ChainId,
	feeMethod: number,
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
	r: string,
	s: string,
	v: string,
	makerProtocolFee: string,
	takerProtocolFee: string,
	type: number,
	quantity: number,
): Promise<Order> => {
	let newOrderOffer = await createOrderService(
		chainId,
		maker,
		taker,
		makerRelayerFee,
		takerRelayerFee,
		feeRecipient,
		side,
		saleKind,
		target,
		itemId,
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
	);
	await updateStatusItemService(createObjIdService(itemId), { offer_status: 1 });
	return newOrderOffer;
};

const buyTransactionService = async (
	chainId: ChainId,
	feeMethod: number,
	maker: string,
	taker: string,
	makerRelayerFee: string,
	takerRelayerFee: string,
	feeRecipient: string,
	side: number,
	saleKind: number,
	target: string,
	itemId: string,
	collectionId: string,
	howToCall: number,
	callData: string,
	replacementPattern: string,
	staticTarget: string,
	staticExtraData: string,
	paymentToken: string,
	basePrice: string,
	finalPrice: string,
	extra: string,
	listingTime: number,
	expirationTime: number,
	salt: string,
	r: string,
	s: string,
	v: string,
	transactionHash: string,
	makerProtocolFee: string,
	takerProtocolFee: string,
	quantity: number,
	orderAcceptedId: string,
): Promise<Order | undefined> => {
	let orderSell: Order = await findOneService(orderModel, { _id: createObjIdService(orderAcceptedId) });
	const token: Token = await getTokenService({ chainId, tokenAddress: paymentToken });
	const symbolToken = token.tokenSymbol;

	if (symbolToken && transactionHash && orderSell)
		await deleteOneService(orderModel, { _id: orderSell._id});
	try {
		const orderBuy = await createOrderService(
			chainId,
			maker,
			taker,
			makerRelayerFee,
			takerRelayerFee,
			feeRecipient,
			side,
			saleKind,
			target,
			itemId,
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
			2,
			quantity,
		);
			console.log('create buy')
		if (orderBuy) {
			const order = await checkItemStatusService(createObjIdService(itemId), 0);
			await Promise.all(
				[
					!order && updateStatusItemService(createObjIdService(itemId), { status: 0 }),
					updateOwnerItemService(itemId, maker, taker),
					updatePriceItemService(itemId, {
						price: finalPrice,
						priceType: symbolToken,
					}),
				].map(async (func: any) => {
					await func;
				}),
			);

			const finalPriceToUSD = await changePriceService(symbolToken, "usd", finalPrice);
			console.log(finalPriceToUSD);
			const item = await findOneService(itemModel, { _id: itemId });
			await Promise.all(
				[
					createHistoryService(
						createObjIdService(item.collectionId),
						createObjIdService(item._id),
						maker,
						taker,
						finalPrice,
						symbolToken,
						0,
						transactionHash,
						3,
					),
					updateVolumeTradedService(createObjIdService(item.collectionId), Number(finalPriceToUSD)),
					createHistoryService(
						createObjIdService(item.collectionId),
						createObjIdService(item._id),
						taker,
						maker,
						"0",
						"eth",
						quantity,
						transactionHash,
						4,
					),
					deleteOneService(orderModel, { _id: orderBuy._id, itemId, type: 2 }),
				].map(async (func: any) => {
					await func;
				}),
			);
		}
		const order = await findOneService(orderModel, { _id: orderBuy._id });
		return order;
	} catch (error: any) {
		console.log(error);
	}
};

const acceptOfferTransactionService = async (
	chainId: ChainId,
	feeMethod: number,
	maker: string,
	taker: string,
	makerRelayerFee: string,
	takerRelayerFee: string,
	feeRecipient: string,
	side: number,
	saleKind: number,
	target: string,
	itemId: string,
	collectionId: string,
	howToCall: number,
	callData: string,
	replacementPattern: string,
	staticTarget: string,
	staticExtraData: string,
	paymentToken: string,
	basePrice: string,
	finalPrice: string,
	extra: string,
	listingTime: number,
	expirationTime: number,
	salt: string,
	r: string,
	s: string,
	v: string,
	transactionHash: string,
	makerProtocolFee: string,
	takerProtocolFee: string,
	quantity: number,
	orderAcceptedId: string,
): Promise<Order | undefined> => {
	let orderOffer: Order = await findOneService(orderModel, { _id: createObjIdService(orderAcceptedId) });

	if (orderOffer) await deleteOneService(orderModel, { _id: orderOffer._id });

	const token: Token = await getTokenService({ chainId, tokenAddress: paymentToken });
	const symbolToken = token.tokenSymbol;

	const orderOfferAccept = await createOrderService(
		chainId,
		maker,
		taker,
		makerRelayerFee,
		takerRelayerFee,
		feeRecipient,
		side,
		saleKind,
		target,
		itemId,
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
		3,
		quantity,
	);
	const item = await findOneService(itemModel, { _id: itemId });

	if (orderOfferAccept) {
		const order = await checkItemStatusService(createObjIdService(itemId), 1);

		await Promise.all(
			[
				!order && updateStatusItemService(createObjIdService(itemId), { offer_status: 0 }),
				updateOwnerItemService(itemId, taker, maker),
				updatePriceItemService(itemId, {
					price: finalPrice,
					priceType: symbolToken,
				}),
			].map(async (func: any) => {
				await func;
			}),
		);

		const finalPriceToUSD = await changePriceService(symbolToken, "usd", finalPrice);

		await Promise.all(
			[
				await createHistoryService(
					createObjIdService(item.collectionId),
					createObjIdService(item._id),
					taker,
					maker,
					finalPrice,
					symbolToken,
					0,
					transactionHash,
					2,
				),
				updateVolumeTradedService(createObjIdService(item.collectionId), Number(finalPriceToUSD)),
				createHistoryService(
					createObjIdService(item.collectionId),
					createObjIdService(item._id),
					maker,
					taker,
					"0",
					"eth",
					quantity,
					transactionHash,
					4,
				),
				deleteOneService(orderModel, { _id: orderOfferAccept._id }),
			].map(async (func: any) => {
				await func;
			}),
		);
	}
	// return await findOneService(orderModel, { maker, taker, itemId, transactionHash, type: { $eq: 3 } });
	return await findOneService(orderModel, { _id: orderOfferAccept._id, type: { $eq: 3 } });
};

export { sellTransactionService, buyTransactionService, offerTransactionService, acceptOfferTransactionService };

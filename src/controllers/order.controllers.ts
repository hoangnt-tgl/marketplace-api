import { Request, Response } from "express";
import { Collection } from "../interfaces/collection.interfaces";
import orderModel from "../models/Order.model";
import historyModel from "../models/history.model";
import collectionModel from "../models/collection.model";
import itemModel from "../models/item.model";
import { Order } from "../interfaces/order.interfaces";
import { Item } from "../interfaces/item.interfaces";
import auctionModel from "../models/auction.model";
import {
	createObjIdService,
	findOneService,
	updateOneService,
	createService,
	queryExistService,
	findManyService,
	deleteOneService,
} from "../services/model.services";
import userModel from "../models/user.model";
import {
	createOrderService,
	getCreationNumService,
	getOrderByIdService,
	deleteOrderService,
	getOrderByItemIdService,
	getOrderByInstantSaleFalseService,
	getOrderByInstantSaleTrueService,
} from "../services/order.services";
import formidable from "formidable";
import { handlePromiseUpload } from "../services/uploadFile.service";
import { LoginUser, User } from "../interfaces/user.interfaces";
import { ResponseAPI } from "../interfaces/responseData.interfaces";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { getBalanceTokenForAccount } from "../services/aptos.services";
import { changePricetoUSD } from "../services/changePrice.services";
import { getDecimalService } from "../services/token.services";
import { getOneItemService } from "../services/item.services";

const sellItem = async (req: Request, res: Response) => {
	try {
		let { userAddress, chainId } = req.params;
		userAddress = userAddress.toLowerCase();
		let { price, quantity, itemId, to, txHash, coinType, startTime, instantSale, auctionId, endTime } = req.body;
		//find id item
		let itemInfo = await findOneService(itemModel, { _id: itemId });
		if (!itemInfo) return res.status(404).json({ error: ERROR_RESPONSE[404] });

		await updateOneService(itemModel, { _id: itemInfo._id }, { price: price, status: 1 });
		let newOrder = {};
		if (instantSale === false) {
			newOrder = {
				chainId: 2,
				maker: userAddress,
				itemId: createObjIdService(itemId),
				minPrice: price,
				coinType: coinType,
				creationNumber: await getCreationNumService(txHash),
				amount: quantity,
				startTime: new Date(Number(startTime)),
				expirationTime: new Date(Number(endTime)),
				instantSale,
				type: 6,
				auctionId,
			};
			let newAuction = {
				chainId: 2,
				itemId: itemId,
				collectionId: createObjIdService(itemInfo.collectionId),
				paymentToken: coinType,
				minPrice: price,
				seller: userAddress,
				startTime: new Date(Number(startTime)),
				endTime: new Date(Number(endTime)),
				isLive: true,
			};
			await createService(auctionModel, newAuction);
		} else {
			newOrder = {
				chainId: 2,
				maker: userAddress,
				itemId: createObjIdService(itemId),
				minPrice: price,
				coinType: coinType,
				creationNumber: await getCreationNumService(txHash),
				amount: quantity,
				startTime: new Date(Number(startTime)),
				expirationTime: new Date(Number(endTime)),
				instantSale,
				type: 6,
			};
		}
		let orderInfo = await createService(orderModel, newOrder);
		let newHistory = {
			collectionId: itemInfo.collectionId,
			itemId: itemInfo._id,
			from: userAddress,
			to: to,
			quantity: quantity,
			type: 6,
			txHash: txHash,
			price: price,
			priceType: coinType,
		};
		createService(historyModel, newHistory);
		return res.status(200).json({ data: orderInfo });
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({ error: "Cannot Sell Item" });
	}
};

const buyItem = async (req: Request, res: Response) => {
	try {
		let { userAddress, chainId } = req.params;
		userAddress = userAddress.toLowerCase();
		let { quantity, itemId, to, txHash, orderId } = req.body;
		let orderInfo = await getOrderByIdService(orderId);
		let itemInfo = await getOneItemService({ _id: itemId });
		if (!itemInfo) return res.status(404).json({ error: ERROR_RESPONSE[404] });
		await updateOneService(
			collectionModel,
			{ _id: itemInfo.collectionId },
			{ volumeTrade: itemInfo.collectionInfo.volumeTrade + orderInfo.minPrice },
		);
		let owners = itemInfo.owner;
		let balance = await getBalanceTokenForAccount(
			orderInfo.maker,
			itemInfo.creator,
			itemInfo.collectionInfo.collectionName,
			"2",
		);
		if (balance === "0") {
			owners = owners.filter((owner: string) => owner !== orderInfo.maker);
		}
		if (!owners.includes(userAddress)) {
			owners.push(userAddress);
		}
		deleteOneService(orderModel, { _id: orderId });
		let isExist = await queryExistService(orderModel, { itemId: itemId, instantSale: false });
		if (!isExist) {
			await updateOneService(itemModel, { _id: itemInfo._id }, { owner: owners, status: 0 });
		} else {
			await updateOneService(itemModel, { _id: itemInfo._id }, { owner: owners });
		}

		let newHistory = {};
		// let decimalToken = await getDecimalService(orderInfo..toString());
		// let priceDecimals = price / 10 ** Number(decimalToken);
		// let priceUSD: Number = await changePricetoUSD(priceType.toString(), Number(priceDecimals));

		newHistory = {
			collectionId: itemInfo.collectionId,
			itemId: itemInfo._id,
			from: userAddress,
			to: to,
			quantity: quantity,
			type: 7,
			txHash: txHash,
			price: orderInfo.minPrice,
			priceType: orderInfo.coinType,
		};
		createService(historyModel, newHistory);
		return res.status(200).json({ data: newHistory });
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({ error: "Cannot buy Item" });
	}
};

const cancelOrder = async (req: Request, res: Response) => {
	try {
		let { userAddress, chainId } = req.params;
		userAddress = userAddress.toLowerCase();
		let { orderId, txHash } = req.body;
		let orderInfo: Order = await findOneService(orderModel, { _id: orderId });
		let itemInfo: Item = await findOneService(itemModel, { _id: orderInfo.itemId });
		let collectionInfo: Collection = await findOneService(collectionModel, { _id: itemInfo.collectionId });
		if (!collectionInfo) return res.status(404).json({ error: ERROR_RESPONSE[404] });
		if (!itemInfo) return res.status(404).json({ error: ERROR_RESPONSE[404] });
		let owners = itemInfo.owner;
		if (!owners.includes(userAddress)) {
			owners.push(userAddress);
		}
		let newHistory = {
			collectionId: collectionInfo._id,
			itemId: itemInfo._id,
			from: userAddress,
			quantity: Number(orderInfo.amount),
			type: 5,
			txHash: txHash,
			price: 0,
		};
		createService(historyModel, newHistory);
		deleteOneService(orderModel, { _id: orderId });
		let findOrderItemId: Order | null = await findManyService(orderModel, { itemId: itemInfo._id });
		if (findOrderItemId === null) {
			await updateOneService(itemModel, { _id: itemInfo._id }, { price: 0, status: 0, owner: owners });
		}
		return res.status(200).json({ message: "Cancel order success" });
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getOrderSellItem = async (req: Request, res: Response) => {
	try {
		let { userAddress, chainId } = req.params;
		userAddress = userAddress.toLowerCase();
		let { itemId } = req.body;
		let orders = await findOneService(orderModel, { isDeleted: false, itemId, chainId, type: 6 });
		return res.status(200).json({ data: orders });
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export const createOrderController = async (req: Request, res: Response) => {
	try {
		const { chainId, maker, itemId, minPrice, coinType, amount, startTime, expirationTime, instantSale, auctionId } =
			req.body;
		const txHash = String(req.body.txHash);
		const creation_number: Number = await getCreationNumService(txHash);
		const order: any = await createOrderService(
			chainId,
			maker,
			itemId,
			minPrice,
			coinType,
			creation_number,
			amount,
			startTime,
			expirationTime,
			instantSale,
			auctionId,
		);
		res.status(200).json({ data: order });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export const getOrderByIdController = async (req: Request, res: Response) => {
	try {
		const { orderId } = req.params;
		const order: Order = await getOrderByIdService(orderId);
		res.status(200).json({ data: order });
	} catch (error: any) {
		return res.status(500).json({ messsage: "Get order fail" });
	}
};

export const deleteOrderController = async (req: Request, res: Response) => {
	try {
		const { orderId } = req.params;
		await deleteOrderService(orderId);
		res.status(200).json({ message: "Delete order success" });
	} catch (error: any) {
		return res.status(500).json({ message: "Delete order fail" });
	}
};

export const getOrderByItemIdController = async (req: Request, res: Response) => {
	try {
		const { itemId } = req.params;
		const orders: Order[] = await getOrderByItemIdService(itemId);
		res.status(200).json({ data: orders });
	} catch (error: any) {
		return res.status(500).json({ message: "Get order by item id fail" });
	}
};

export const getOrderByInstantSaleTrueController = async (req: Request, res: Response) => {
	try {
		const orders: Order[] = await getOrderByInstantSaleTrueService();
		res.status(200).json({ data: orders });
	} catch (error: any) {
		return res.status(500).json({ message: "Get order by instant sale true fail" });
	}
};

export const getOrderByInstantSaleFalseController = async (req: Request, res: Response) => {
	try {
		const orders: Order[] = await getOrderByInstantSaleFalseService();
		res.status(200).json({ data: orders });
	} catch (error: any) {
		return res.status(500).json({ message: "Get order by instant sale false fail" });
	}
};

export { buyItem, sellItem, cancelOrder, getOrderSellItem };

import { Request, Response } from "express";
import { Collection } from "../interfaces/collection.interfaces";
import orderModel from "../models/Order.model";
import historyModel from "../models/history.model";
import collectionModel from "../models/collection.model";
import itemModel from "../models/item.model";
import { Order } from "../interfaces/order.interfaces";

import {
	findOneService,
	updateOneService,
	createService,
	queryExistService,
	findManyService,
	deleteOneService,
} from "../services/model.services";
import userModel from "../models/user.model";
import { createOrderService, getCreationNumService, getOrderByIdService, deleteOrderService } from "../services/order.services";
import formidable from "formidable";
import { handlePromiseUpload } from "../services/uploadFile.service";
import { LoginUser, User } from "../interfaces/user.interfaces";
import { ResponseAPI } from "../interfaces/responseData.interfaces";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { getBalanceTokenForAccount } from "../services/aptos.services";
import { async } from "@firebase/util";

const sellItem = async (req: Request, res: Response) => {
	try {
		let { userAddress, chainId } = req.params;
		userAddress = userAddress.toLowerCase();
		let { price, quantity, itemId, to, txHash, collectionId, collectionName, itemName, creator } = req.body;
		let collectionInfo = await findOneService(collectionModel, { collectionName, userAddress: creator, chainId });
		if (!collectionInfo) return res.status(404).json({ error: ERROR_RESPONSE[404] });
		let itemInfo = await findOneService(itemModel, { itemName, collectionId: collectionInfo._id });
		if (!itemInfo) return res.status(404).json({ error: ERROR_RESPONSE[404] });
		let balanceOwner = await getBalanceTokenForAccount(userAddress, creator, collectionName, itemName, chainId);
		console.log(balanceOwner);
		let owners = itemInfo.owner;
		if (balanceOwner.toString() === "0") {
			owners = owners.filter((item: any) => item !== userAddress);
		}
		await updateOneService(itemModel, { _id: itemInfo._id }, { price: price, status: 1, owner: owners });
		let newOrder = {
			maker: userAddress,
			chainId: chainId,
			quantity: quantity,
			itemId: itemInfo._id,
			basePrice: price,
			type: 6,
		};
		let orderInfo = await createService(orderModel, newOrder);
		let newHistory = {
			collectionId: collectionInfo._id,
			itemId: itemInfo._id,
			from: userAddress,
			to: to,
			quantity: quantity,
			type: 6,
			txHash: txHash,
			price: price,
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
		let { quantity, itemId, to, txHash, collectionId, owner, collectionName, itemName, price, creator } = req.body;
		let collectionInfo = await findOneService(collectionModel, { collectionName, userAddress: creator, chainId });
		if (!collectionInfo) return res.status(404).json({ error: ERROR_RESPONSE[404] });
		let itemInfo = await findOneService(itemModel, { itemName, collectionId: collectionInfo._id });
		if (!itemInfo) return res.status(404).json({ error: ERROR_RESPONSE[404] });
		updateOneService(collectionModel, { _id: collectionInfo._id }, { volumeTrade: collectionInfo.volumeTrade + price });
		let owners = itemInfo.owner;
		if (!owners.includes(userAddress)) {
			owners.push(userAddress);
		}
		await updateOneService(itemModel, { _id: itemInfo._id }, { owner: owners, status: 0 });
		deleteOneService(orderModel, { itemId: itemInfo._id });
		let newHistory = {
			collectionId: collectionInfo._id,
			itemId: itemInfo._id,
			from: userAddress,
			to: to,
			quantity: quantity,
			type: 7,
			txHash: txHash,
			price: price,
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
		let { itemId, collectionId, owner, collectionName, itemName, creator, to, txHash, quantity } = req.body;
		let collectionInfo = await findOneService(collectionModel, { collectionName, userAddress: creator, chainId });
		if (!collectionInfo) return res.status(404).json({ error: ERROR_RESPONSE[404] });
		let itemInfo = await findOneService(itemModel, { itemName, collectionId: collectionInfo._id });
		if (!itemInfo) return res.status(404).json({ error: ERROR_RESPONSE[404] });
		let owners = itemInfo.owner;
		if (!owners.includes(userAddress)) {
			owners.push(userAddress);
		}
		await updateOneService(itemModel, { _id: itemInfo._id }, { price: 0, status: 0, owner: owners });
		deleteOneService(orderModel, { itemId: itemInfo._id });
		let newHistory = {
			collectionId: collectionInfo._id,
			itemId: itemInfo._id,
			from: userAddress,
			to: to,
			quantity: quantity,
			type: 5,
			txHash: txHash,
			price: 0,
		};
		createService(historyModel, newHistory);
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

export const createOrderController = async(req: Request, res: Response) => {
	try{
		const {
			chainId, 
			maker, 
			itemId, 
			minPrice, 
			coinType, 
			amount, 
			startTime, 
			expirationTime, 
			instantSale, 
			auctionId } = req.body;
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
			auctionId
		);
		res.status(200).json({data: order});
	} catch(error: any){
		return res.status(500).json({error: ERROR_RESPONSE[500]});
	}
};

export const getOrderByIdController = async(req: Request, res: Response) => {
	try{
		const { orderId } = req.params;
		const order: Order = await getOrderByIdService(orderId);
		res.status(200).json({data: order});
	} catch(error: any){
		return res.status(500).json({ messsage: "Get order fail" });
	}
};

export const deleteOrderController = async(req: Request, res: Response) => {
	try{
		const { orderId } = req.params;
		await deleteOrderService(orderId);
		res.status(200).json({message: "Delete order success"});
	} catch(error: any){
		return res.status(500).json({ message: "Delete order fail" });
	}
};
export { buyItem, sellItem, cancelOrder, getOrderSellItem };

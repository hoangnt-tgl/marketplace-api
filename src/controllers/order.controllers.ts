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

import formidable from "formidable";
import { handlePromiseUpload } from "../services/uploadFile.service";
import { LoginUser, User } from "../interfaces/user.interfaces";
import { ResponseAPI } from "../interfaces/responseData.interfaces";
import { ERROR_RESPONSE } from "../constant/response.constants";

const sellItem = async (req: Request, res: Response) => {
	try {
		let { userAddress, chainId } = req.params;
		userAddress = userAddress.toLowerCase();
		let { price, quantity, itemId, to, txHash, collectionId, owner, collectionName, itemName, creator } = req.body;
		let collectionInfo = await findOneService(collectionModel, { collectionName, userAddress: creator, chainId });
		if (!collectionInfo) return res.status(404).json({ error: ERROR_RESPONSE[404] });
		let itemInfo = await findOneService(itemModel, { itemName, collectionId: collectionInfo._id });
		if (!itemInfo) return res.status(404).json({ error: ERROR_RESPONSE[404] });
		await updateOneService(itemModel, { _id: itemInfo._id }, { price: price, status: 1 });
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
		let owners = itemInfo.owner.filter((item: any) => item !== owner);
		owners.push(userAddress);
		await updateOneService(itemModel, { _id: itemInfo._id }, { owner: owners, status: 0 });
		updateOneService(collectionModel, { _id: collectionInfo._id }, { volumeTrade: collectionInfo.volumeTrade + price });
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

export { buyItem, sellItem };

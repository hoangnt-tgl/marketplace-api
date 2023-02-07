import { Request, Response } from "express";
import { Item } from "../interfaces/item.interfaces";
import ItemModel from "../models/item.model";
import interactionModel from "../models/interaction.model";
import { ERROR_RESPONSE } from "../constant/response.constants";
import historyModel from "../models/history.model";
import {
	findOneService,
	findManyService,
	updateOneService,
	createService,
	queryExistService,
	countByQueryService,
} from "../services/model.services";

import {
	getAllItemService,
	getOneItemService,
	getListSelectItemService,
	getListRandomItemService,
} from "../services/item.services";

const createItem = async (req: Request, res: Response) => {
	try {
		let { chainId, userAddress } = req.params;
		let newItem: Item = req.body;
		newItem.creator = userAddress;
		newItem.chainId = chainId;
		newItem.owner = [userAddress];
		const existItem = await queryExistService(ItemModel, {
			collectionId: newItem.collectionId,
			itemName: newItem.itemName,
		});
		if (existItem) return res.status(403).json({ error: ERROR_RESPONSE[403] });
		let itemInfo = await createService(ItemModel, newItem);
		let newHistory = {
			collectionId: newItem.collectionId,
			itemId: itemInfo._id,
			from: userAddress,
			to: req.body.to,
			quantity: newItem.amount,
			type: 1,
			txHash: req.body.txHash,
		};
		createService(historyModel, newHistory);
		return res.status(200).json({ data: itemInfo });
	} catch (error: any) {
		return res.status(500).json({ error: "Cannot Create Item" });
	}
};

const getItemById = async (req: Request, res: Response) => {
	try {
		let { itemId } = req.params;
		let itemInfo = await getOneItemService({ _id: itemId });
		if (!itemInfo) return res.status(404).json({ error: ERROR_RESPONSE[404] });
		return res.status(200).json({ data: itemInfo });
	} catch (error: any) {
		return res.status(500).json({ error: "Cannot get Item" });
	}
};

const getAllItem = async (req: Request, res: Response) => {
	try {
		let { chainId } = req.params;
		let listItem = await getAllItemService({ chainId });
		return res.status(200).json({ data: listItem });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getItemForUser = async (req: Request, res: Response) => {
	try {
		let { chainId, userAddress } = req.params;
		let listItem = await getAllItemService({ chainId, owner: { $all: userAddress } });
		return res.status(200).json({ data: listItem });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export const showSelectItemController = async (req: Request, res: Response) => {
	try {
		const list = req.body.listitem;
		const listItem = await getListSelectItemService(list);
		return res.status(200).json({ data: listItem });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export const showRandomListItemController = async (req: Request, res: Response) => {
	try {
		const listItem: Item[] = await getListRandomItemService();
		return res.status(200).json({ data: listItem });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export { createItem, getItemById, getAllItem, getItemForUser };

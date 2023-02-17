import { Request, Response } from "express";
import { Item, ItemInfoCreated } from "../interfaces/item.interfaces";
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
	getListItemByCreatedService,
	getListItemByOwnerService,
	getTransactionService,
	updateItemService,
} from "../services/item.services";
import fs from "fs";

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

export const getListItemByCreatedController = async (req: Request, res: Response) => {
	try {
		const userAddress: String = req.params.userAddress;
		const result: Item[] = await getListItemByCreatedService(userAddress);
		return res.status(200).json({ data: result });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export const getListItemByOwnerController = async (req: Request, res: Response) => {
	try {
		const userAddress: String = req.params.userAddress;
		const result: Item[] = await getListItemByOwnerService(userAddress);
		return res.status(200).json({ data: result });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export const getTranController = async (req: Request, res: Response) => {
	try {
		const result: any = await getTransactionService();
		return res.status(200).json({ result });
	} catch (error) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export const setItemController = async (req: Request, res: Response) => {
	try {
		const listItemId = req.body.listItemId;
		// fs.writeFileSync("./public/listItemId.json", JSON.stringify(listItemId));
		fs.writeFile("./public/listItemId.json", JSON.stringify(listItemId), "utf8", () => {
			console.log(`Update lits item successfully at ${new Date(Date.now())}`);
		});
		return res.status(200).json({ result: "success" });
	} catch (error) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export const getItemController = async (req: Request, res: Response) => {
	try {
		const listItemId = JSON.parse(fs.readFileSync("./public/listItemId.json", "utf8"));
		const listItem = await getListSelectItemService(listItemId);
		return res.status(200).json({ data: listItem });
	} catch (error) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export const updateOwnerController = async (req: Request, res: Response) => {
	try{
		const { itemId, send, receive, quantity, txHash } = req.body;
		const result = await updateItemService(itemId, send, receive, quantity, txHash);
		return res.status(200).json({ data: result });
	} catch(error: any){
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export { createItem, getItemById, getAllItem, getItemForUser };

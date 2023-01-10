import { Request, Response } from "express";
import { Item } from "../interfaces/item.interfaces";
import ItemModel from "../models/item.model";
import { ERROR_RESPONSE } from "../constant/response.constants";
import {
	findOneService,
	updateOneService,
	createService,
	queryExistService,
	createObjIdService,
} from "../services/model.services";

const createItem = async (req: Request, res: Response) => {
	try {
		let { chainId, userAddress } = req.params;
		let newItem: Item = req.body;
		newItem.creator = userAddress;
		newItem.chainId = chainId;
		const existItem = await queryExistService(ItemModel, {
			collectionId: newItem.collectionId,
			itemName: newItem.itemName,
		});
		if (existItem) return res.status(403).json({ error: ERROR_RESPONSE[403] });
		let itemInfo = await createService(ItemModel, newItem);
		return res.status(200).json({ data: itemInfo });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getItemById = async (req: Request, res: Response) => {
	try {
		let { itemId } = req.params;
		let itemInfo = await findOneService(ItemModel, { _id: itemId });
		if (!itemInfo) return res.status(404).json({ error: ERROR_RESPONSE[404] });
		return res.status(200).json({ data: itemInfo });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export { createItem, getItemById };

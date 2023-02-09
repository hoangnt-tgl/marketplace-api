import { Request, Response } from "express";
import { Collection } from "../interfaces/collection.interfaces";
import collectionModel from "../models/collection.model";
import itemModel from "../models/item.model";
import interactionModel from "../models/interaction.model";
import historyModel from "../models/history.model";
import { History } from "../interfaces/history.interfaces";
import { ERROR_RESPONSE } from "../constant/response.constants";
import {
	findOneService,
	updateOneService,
	createService,
	queryExistService,
	findManyService,
	deleteOneService,
} from "../services/model.services";
import { getOneItemService } from "../services/item.services";
import { Item } from "../interfaces/item.interfaces";

const createInteractionController = async (req: Request, res: Response) => {
	try {
		let { userAddress, chainId } = req.params;
		let { itemId, state } = req.body;
		userAddress = userAddress.toLowerCase();

		let itemExist = await queryExistService(itemModel, { _id: itemId });
		if (!itemExist) return res.status(404).json({ error: ERROR_RESPONSE[404] });
		await findManyService(interactionModel, { itemId, userAddress });
		if (state == true) {
			await createService(interactionModel, { itemId, userAddress, state });
		}
		return res.status(200).json("Like item success");
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getListItemInteractionController = async (req: Request, res: Response) => {
	try {
		let { userAddress } = req.params;
		let listInteract = await findManyService(interactionModel, { userAddress, state: true });
		let listItem: Item[] = [];
		await Promise.all(
			listInteract.map(async (item: any) => {
				const items: Item | null = await getOneItemService({ _id: item.itemId });
				if (items !== null) {
					listItem.push(items);
				}
			}),
		);
		return res.status(200).json({ data: listItem });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export { createInteractionController, getListItemInteractionController };

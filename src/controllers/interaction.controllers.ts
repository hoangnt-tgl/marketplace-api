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
} from "../services/model.services";

const createInteractionController = async (req: Request, res: Response) => {
	try {
		let { userAddress, chainId } = req.params;
		let { itemId, state } = req.body;
		userAddress = userAddress.toLowerCase();
		let itemExist = await queryExistService(itemModel, { _id: itemId });
		if (!itemExist) return res.status(404).json({ error: ERROR_RESPONSE[404] });
		let interactionExist = await queryExistService(interactionModel, { itemId, userAddress });
		if (interactionExist) {
			await updateOneService(interactionModel, { itemId, userAddress }, { state });
		} else {
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
		let listItem = listInteract.map((item: any) => item.itemId);
		return res.status(200).json({ data: listItem });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export { createInteractionController, getListItemInteractionController };

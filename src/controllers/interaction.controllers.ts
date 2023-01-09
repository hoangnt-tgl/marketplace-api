import { Request, Response } from "express";
import { MongooseObjectId } from "../interfaces/responseData.interfaces";
import { ItemInteraction } from "../interfaces/item.interfaces";
import {
	checkUserIsLikeItemService,
	createInteractionService,
	getInteractionByUserService,
} from "../services/interactions.services";
import { ERROR_RESPONSE } from "../constant/response.constants";

const createInteractionController = async (req: Request, res: Response) => {
	const { userAddress, itemId, state }: { userAddress: string, itemId: string, state: boolean } = req.body;
	try {
		const interaction: ItemInteraction = await createInteractionService(userAddress, itemId, state);

		return res.status(200).json(interaction);
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getListInteractionsController = async (req: Request, res: Response) => {
	try {
		const userAddress = req.params.userAddress;
		const listInteractions: MongooseObjectId[] = await getInteractionByUserService(userAddress);
		if (listInteractions) {
			return res.status(200).json({ data: listInteractions });
		} else {
			return res.status(400).json({ error: ERROR_RESPONSE[500] });
		}
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const checkUserIsLikeItemController = async (req: Request, res: Response) => {
	const itemId: string = req.params.itemId;
	const userAddress: string = req.params.userAddress;
	try {
		const result = await checkUserIsLikeItemService(userAddress, itemId);
		return res.status(200).json({ data: result });
	} catch (error: any) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

export { createInteractionController, getListInteractionsController, checkUserIsLikeItemController };

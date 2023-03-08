import { Response, Request } from "express";
import { IEvent } from "./../interfaces/event.interface";
import { createService, findManyService } from "../services/model.services";
import itemModel from "../models/item.model";
import eventModel from "../models/event.model";
import historyModel from "../models/history.model";
import { DEFAULT_COLLECTION_PREDICTION } from "../constant/default.constant";
const createEventController = async (req: Request, res: Response) => {
	try {
		const newEvent: IEvent = req.body;
		const { userAddress } = req.body;
		const resData = await createService(eventModel, newEvent);
		newEvent.options.map(async (option: any) => {
			const item = {
				itemName: `Event #${newEvent.id} ${option}`,
				itemMedia: newEvent.image,
				description: newEvent.description,
				chainId: newEvent.chainId,
				priceType: newEvent.coinType,
				collectionId: DEFAULT_COLLECTION_PREDICTION,
				creator: userAddress,
				owner: [userAddress],
			};
			let itemInfo = await createService(itemModel, item);
			console.log(itemInfo);
			let newHistory = {
				collectionId: DEFAULT_COLLECTION_PREDICTION,
				itemId: itemInfo._id,
				from: userAddress,
				type: 1,
				txHash: req.body.txHash,
			};
			createService(historyModel, newHistory);
		});
		res.status(200).json(resData);
	} catch (error: any) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

const getAllEventController = async (req: Request, res: Response) => {
	try {
		const { chainId } = req.params;
		const data = await findManyService(eventModel, { chainId });
		res.status(200).json(data);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};
export { createEventController, getAllEventController };

import { Response, Request } from "express";
import { IEvent } from "./../interfaces/event.interface";
import {
	createService,
	deleteManyService,
	deleteOneService,
	findManyService,
	findOneService,
	updateOneService,
} from "../services/model.services";
import itemModel from "../models/item.model";
import eventModel from "../models/event.model";
import historyModel from "../models/history.model";
import { DEFAULT_COLLECTION_PREDICTION } from "../constant/default.constant";
import { getOneItemService } from "../services/item.services";
import { getBalanceTokenForAccount } from "../services/aptos.services";
const createEventController = async (req: Request, res: Response) => {
	try {
		const newEvent: IEvent = req.body;
		newEvent.options = newEvent.options.map((option: any) => {
			return { name: option, value: "0" };
		});
		const { userAddress } = req.body;

		await Promise.all(
			newEvent.options.map(async (option: any, index: number) => {
				const item = {
					itemName: `Event #${newEvent.id} ${option.name}`,
					itemMedia: newEvent.image,
					description: newEvent.description,
					chainId: newEvent.chainId,
					priceType: newEvent.coinType,
					collectionId: DEFAULT_COLLECTION_PREDICTION,
					creator: userAddress,
					owner: [userAddress],
				};
				let itemInfo = await createService(itemModel, item);
				newEvent.options[index].itemId = itemInfo._id;
				let newHistory = {
					collectionId: DEFAULT_COLLECTION_PREDICTION,
					itemId: itemInfo._id,
					from: userAddress,
					type: 1,
					txHash: req.body.txHash,
				};
				createService(historyModel, newHistory);
			}),
		);
		const resData = await createService(eventModel, newEvent);
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

const getEventByIdController = async (req: Request, res: Response) => {
	try {
		const { eventId } = req.params;
		const data = await findOneService(eventModel, { _id: eventId });
		res.status(200).json(data);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

const predictEventController = async (req: Request, res: Response) => {
	try {
		const { eventId, optionId } = req.params;
		const { userAddress, amount, txHash } = req.body;
		let eventInfo = await findOneService(eventModel, { _id: eventId });
		if (!eventInfo) {
			res.status(400).json({ message: "Event not found" });
		}
		await Promise.all(
			eventInfo.options.map(async (option: any) => {
				if (option._id == optionId) {
					option.value = Number(option.value) + Number(amount);
					let newHistory = {
						collectionId: DEFAULT_COLLECTION_PREDICTION,
						itemId: option.itemId,
						from: userAddress,
						quantity: amount,
						to: eventInfo.userAddress,
						type: 15,
						txHash: txHash,
						price: amount,
						priceType: eventInfo.coinType,
					};
					createService(historyModel, newHistory);
				}
			}),
		);
		let newEnventInfo = await updateOneService(eventModel, { _id: eventId }, { options: eventInfo.options });
		res.status(200).json(newEnventInfo);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

const cancelEventController = async (req: Request, res: Response) => {
	try {
		const { eventId } = req.params;
		const eventInfo = await findOneService(eventModel, { _id: eventId });
		if (!eventInfo) {
			res.status(400).json({ message: "Event not found" });
		}
		eventInfo.options.map(async (option: any) => {
			deleteOneService(itemModel, { _id: option.itemId });
		});
		deleteOneService(eventModel, { _id: eventId });
		res.status(200).json({ message: "Delete event success" });
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

const finalizeEventController = async (req: Request, res: Response) => {
	try {
		const { eventId } = req.params;
		res.status(200).json({ message: "" });
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

const redeemEventController = async (req: Request, res: Response) => {
	try {
		const { eventId } = req.params;
		const { userAddress, itemId } = req.body;
		let itemInfo = await getOneItemService({ _id: itemId });
		if (!itemInfo) return res.status(400).json({ message: "item not found" });
		let balance = await getBalanceTokenForAccount(
			userAddress,
			itemInfo?.creator,
			itemInfo?.collectionInfo.collectionName,
			itemInfo?.chainId,
		);
		let owners = itemInfo.owner;
		if (balance === "0") {
			owners = owners.filter(ele => ele !== userAddress);
		}
		await updateOneService(itemModel, { _id: itemId }, { owner: owners });
		res.status(200).json({ message: "redeem successful" });
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};
export {
	createEventController,
	getAllEventController,
	getEventByIdController,
	predictEventController,
	cancelEventController,
	finalizeEventController,
	redeemEventController,
};

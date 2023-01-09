import { Types } from "mongoose";
import { MongooseObjectId } from "../interfaces/responseData.interfaces";
import { ItemInteraction } from "../interfaces/item.interfaces";
import interactionModel from "../models/interaction.model";

import {
	createObjIdService,
	createService,
	queryExistService,
	updateOneService,
	findManyService,
	findOneService,
} from "./model.services";

const createInteractionService = async (
	userAddress: string,
	itemId: string,
	state: boolean,
): Promise<ItemInteraction> => {
	const check: boolean = await checkInteractionsExist(userAddress, itemId);
	if (!check) {
		const newInteractions: ItemInteraction = await createService(interactionModel, {
			userAddress,
			itemId: createObjIdService(itemId),
			state,
		});
		return newInteractions;
	}
	const interaction: ItemInteraction = await updateOneService(
		interactionModel,
		{
			userAddress,
			itemId: createObjIdService(itemId),
		},
		{
			state,
		},
	);
	return interaction;
};

const checkUserIsLikeItemService = async (
	userAddress: string | undefined = undefined,
	itemId: string,
): Promise<{ isLike: boolean }> => {
	if (userAddress) {
		const interaction: ItemInteraction = await findOneService(
			interactionModel,
			{ userAddress, itemId: createObjIdService(itemId) },
			"state",
		);
		if (interaction) {
			return { isLike: interaction.state };
		}
	}
	return { isLike: false };
};

const getInteractionsOfItemService = async (itemId: Types.ObjectId): Promise<{ itemInteraction: number }> => {
	const amount = await findManyService(interactionModel, { itemId, state: true }, "_id");
	return { itemInteraction: amount.length };
};

const getManyInteractionService = async (objQuery: any, properties: string = ""): Promise<ItemInteraction[]> => {
	const interactions: ItemInteraction[] = await findManyService(interactionModel, objQuery, properties);
	return interactions;
};

const checkInteractionsExist = async (userAddress: string, itemId: string): Promise<boolean> => {
	return await queryExistService(interactionModel, { userAddress, itemId: createObjIdService(itemId) });
};

const getInteractionByUserService = async (userAddress: string) => {
	const listInteractions: ItemInteraction[] = await getManyInteractionService({ userAddress, state: true }, "itemId");
	const returnData: MongooseObjectId[] = [];
	listInteractions.map((interaction: ItemInteraction) => {
		returnData.push({ _id: interaction.itemId.toString() });
	});
	return returnData;
};

export {
	createInteractionService,
	getInteractionsOfItemService,
	getInteractionByUserService,
	checkUserIsLikeItemService,
	getManyInteractionService,
};

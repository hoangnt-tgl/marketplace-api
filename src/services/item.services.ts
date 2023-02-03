import itemModel from "../models/item.model";

import { Item } from "../interfaces/item.interfaces";

import {
	createObjIdService,
	createService,
	deleteObjService,
	findManyService,
	findOneService,
	queryExistService,
	queryItemsOfModelInPageService,
	updateObjService,
	updateOneService,
	countByQueryService,
} from "./model.services";
import {
	getDataFromURL,
	getSortObj,
	multiProcessService,
	paginateArrayService,
	removeUndefinedOfObj,
} from "./other.services";

import interactionModel from "../models/interaction.model";

const getOneItemService = async (objQuery: any, properties: string = ""): Promise<Item | null> => {
	objQuery = removeUndefinedOfObj(objQuery);
	const item: Item | null = await itemModel
		.findOne(objQuery, properties)
		.lean()
		.populate({ path: "collectionInfo" })
		.populate({ path: "ownerInfo", select: "userAddress avatar username" })
		.populate({ path: "creatorInfo", select: "userAddress avatar username" });
	if (!item) return null;
	item.countFav = await countByQueryService(interactionModel, { itemId: item._id, state: true });
	return item;
};
const checkItemExistsService = async (queryObj: object): Promise<boolean> => {
	return await queryExistService(itemModel, queryObj);
};

const getAllItemService = async (objQuery: any, properties: string = ""): Promise<Item[]> => {
	objQuery = removeUndefinedOfObj(objQuery);
	let itemList: Item[] = await itemModel
		.find(objQuery, properties)
		.lean()
		.populate({ path: "collectionInfo" })
		.populate({ path: "ownerInfo", select: "userAddress avatar username" })
		.populate({ path: "creatorInfo", select: "userAddress avatar username" });
	itemList = await Promise.all(
		itemList.map(async (item: any) => {
			let newItem = item;
			newItem.countFav = await countByQueryService(interactionModel, { itemId: item._id, state: true });
			return newItem;
		}),
	);
	itemList = itemList.sort((a: any, b: any) => b.countFav - a.countFav);
	return itemList;
};

export { getOneItemService, getAllItemService };

import itemModel from "../models/item.model";

import { Item, SelectItem } from "../interfaces/item.interfaces";

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
import { async } from "@firebase/util";

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

export const checkChainIdItemService = async (id: String, chainId: Number) => {
	const items: Item = await findOneService(itemModel, { _id: id });
	if (Number(items.chainId) === chainId) {
		return true;
	} else return false;
};

export const getListSelectItemService = async (listItem: SelectItem[]) => {
	let item: Item[] = [];
	await Promise.all(
		listItem.map(async (items: SelectItem) => {
			const getItem: Item = await findOneService(itemModel, { _id: items.itemId });
			item.push(getItem);
		}),
	);
	return item;
};

const randomListItem = async (arr: Item[], n: number) => {
	let result: Item[] = [];
	let randomIndex;
	let length = arr.length;
	for (let i = 0; i < n; i++) {
		randomIndex = Math.floor(Math.random() * length);
		result.push(arr.splice(randomIndex, 1)[0]);
		length--;
	}
	return result;
};

export const getListRandomItemService = async () => {
	const allItem = await findManyService(itemModel, {});
	const result: Item[] = await randomListItem(allItem, 10);
	return result;
};

export const getListItemByCreatedService = async (userAddress: String) => {
	const item: Item[] = await findManyService(itemModel, { creator: userAddress });
	return item;
};

export const getListItemByOwnerService = async (userAddress: String) => {
	const itemAll: Item[] = await findManyService(itemModel, {});
	const item: Item[] = [];
	Promise.all(
		itemAll.map(async (items: Item) => {
			if (items.creator !== userAddress) {
				const owner: String[] = items.owner;
				if (owner.includes(userAddress)) {
					item.push(items);
				}
			}
		}),
	);
	return item;
};

export { getOneItemService, getAllItemService };

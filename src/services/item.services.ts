import itemModel from "../models/item.model";

import { Item, ItemInfoCreated } from "../interfaces/item.interfaces";

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
import { getOneUserService } from "./user.services";
import interactionModel from "../models/interaction.model";
import { async } from "@firebase/util";
import { getHistoryByUserService } from "./history.services";
import axios from "axios";
import { History } from "../interfaces/history.interfaces";

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

export const getListSelectItemService = async (listItem: []) => {
	let items: Item[] = [];
	await Promise.all(
		listItem.map(async (id: String) => {
			const item: Item | null = await getOneItemService({ _id: id });
			if (item) {
				items.push(item);
			}
		}),
	);
	return items;
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
	const item: Item[] = await getAllItemService({ creator: userAddress });
	return item;
};

export const getListItemByOwnerService = async (userAddress: String) => {
	const itemAll: Item[] = await getAllItemService({});
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

const getTransactions = async (address: any) => {
	const response = await axios.get(`https://fullnode.testnet.aptoslabs.com/v1/accounts/${address}/transactions`);
	const result: String[] = [];
	const data: [] = response.data;
	await Promise.all(
		data.map(async (dataM: any) => {
			const history: History[] = await getHistoryByUserService(address, {});
			const hash: String[] = history.map((hash: History) => hash.txHash);
			// console.log(hash);
			await Promise.all(
				hash.map(async (txhash: String) => {
					if (String(dataM.hash) !== String(txhash)) {
						result.push(String(dataM.hash));
						console.log(String(dataM.hash));
					}
				}),
			);
		}),
	);
	const transactions = result;
	return transactions;
};

export const getTransactionService = async () => {
	const address = "0xf72cd5aa323a3e36ba73807f588885e047a5d1446dbccde3d4a4e8d6f6d8259f";
	const transactions = await getTransactions(address);
	// console.log(transactions);
	return transactions;
};

export { getOneItemService, getAllItemService, checkItemExistsService };

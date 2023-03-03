import itemModel from "../models/item.model";
import historyModel from "../models/history.model";
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
	deleteManyService,
	updateManyService,
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
import { getHistoryByUserService, getHistoryByItemService } from "./history.services";
import axios from "axios";
import { History } from "../interfaces/history.interfaces";
import { getBalanceTokenForAccount } from "./aptos.services"; 
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
	const address = "0xfe72e4ba98b4052434f7313c9c93aea1a0ee6f0c54892e6435fb92ea53cfda0a";
	const transactions = await getTransactions(address);
	return transactions;
};

export const updateItemService = async (id: String, send: string, receive: String, quantity: Number, txHash: String) => {
	const item: Item | null = await getOneItemService({ _id: id });
	if (item) {
		let owner: String[] = item.owner;
		const quantitySend = await getBalanceTokenForAccount(send, item?.creator!, item?.collectionInfo.collectionName!, item?.itemName!, item?.chainId!);
		if (quantitySend === "0") {
			owner = owner.filter((address: String) => address !== send);
		};
		if (!owner.includes(receive)) {
			owner.push(receive);
		};
		// const owner: String[] = item.owner;
		// let check = false;
		// owner.map((address: String, index) => {
		// 	if(send === address){
		// 		owner.splice(index, 1);
		// 	}
		// 	if(receive === address){
		// 		check = true;
		// 	}
		// });
		// if(!check){
		// 	owner.push(receive);
		// }
		const newHistory = {
			collectionId: createObjIdService(String(item.collectionId)),
			itemId: createObjIdService(String(item._id)),
			from: String(send),
			to: String(receive),
			price: 0,
			quantity: Number(quantity),
			txHash: String(txHash),
			type: 4,
		};
		await createService(historyModel, newHistory);
		const itemUpdate: Item = await updateOneService(itemModel, { _id: id }, { owner });
		return itemUpdate;
	} else return null;
};

export const getVolumeAllItemService = async () => {
	const item: Item[] = await getAllItemService({});
	await Promise.all(
		item.map(async (items: Item) => {
			await getVolumeItemService(String(items._id));
			// const volume: { volume: Number, date: Number, month: Number, year: Number } = await getVolumeItemService(String(items._id));
			// console.log(volume);
		}))
	return 1;
};

export const getVolumeItemService = async (id: string) => {
	let result: any[] = [];
	let volume: { avgPrice: Number, date: Date, days: Number, month: Number, year: Number } = { avgPrice: 0, date: new Date(), days: 0, month: 0, year: 0 };
	const history: History[] = await getHistoryByItemService(id, { type: 7 });
	console.log(id);
	history.forEach((history: History) => {
		let index = result.findIndex((volume: any) => volume.days == history.createdAt.getDate() && volume.month == history.createdAt.getMonth() && volume.year == history.createdAt.getFullYear());
		console.log(index)
		if (index !== -1) {
			let newVolume = result[index];
			newVolume.avgPrice = Number(newVolume.avgPrice) + Number(history.price);
			result[index] = newVolume;
		} else {
			volume = { avgPrice: 0, date: new Date(), days: 0, month: 0, year: 0};
			volume.avgPrice = Number(history.price);
			volume.date = history.createdAt;
			volume.days = Number(history.createdAt.getDate());
			volume.month = Number(history.createdAt.getMonth());
			volume.year = Number(history.createdAt.getFullYear());
			console.log("Volume: ",volume)
			result.push(volume);
		}
	})
	return result;
};

// updateOneService(itemModel, {status: 1}, {status: 0})

export { getOneItemService, getAllItemService, checkItemExistsService };


const updateOwnerItem = async () => {
	const items = await getAllItemService({});
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const owners = item.owner;
		for (let j = 0; j < owners.length; j++) {
			const owner = owners[j];
			const balance = await getBalanceTokenForAccount(owner, item.creator, item.collectionInfo.collectionName, item.itemName, item.chainId).then((balance) => balance).catch((err) => console.log(err));
			if (balance === "0") {
				owners.splice(j, 1);
				j--;
			}
		}
		await updateOneService(itemModel, { _id: item._id }, { owner: owners });
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log(i);
	}
	console.log("Done");
}

const deletaItemNotOwner = async () => {
	deleteManyService(itemModel, { owner: [] });
}

const updateStatusItem = async () => {
	updateManyService(itemModel, { status: 1 }, { status: 0 });
}
// updateStatusItem();
// deletaItemNotOwner();

// updateOwnerItem();


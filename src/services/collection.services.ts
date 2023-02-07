import collectionModel from "../models/collection.model";
import itemModel from "../models/item.model";
import historyModel from "../models/history.model";
import { Types } from "mongoose";
import { ListResponseAPI, MongooseObjectId } from "../interfaces/responseData.interfaces";
import {
	Collection,
	ExtraInfoCollection,
	LessInfoCollection,
	TopCollection,
} from "../interfaces/collection.interfaces";
import { Item } from "../interfaces/item.interfaces";
import {
	createObjIdService,
	createService,
	findManyService,
	findOneService,
	queryItemsOfModelInPageService,
	updateOneService,
} from "./model.services";
import { getHistoryTradeByDayService } from "../services/history.services";

import { getSortObj, multiProcessService, paginateArrayService, removeUndefinedOfObj } from "./other.services";
import fs from "fs";

const getTopCollectionService = async (
	sortBy:
		| "volumeTrade"
		| "floorPrice"
		| "volume24Hour"
		| "volume7Days"
		| "volume30Days"
		| "percent24Hour"
		| "percent7Days"
		| "percent30Days" = "volumeTrade",
	sortFrom: "desc" | "asc",
	objectQuery: any = {},
	pageSize: number,
	pageId: number,
	chainId: string,
): Promise<ListResponseAPI<ExtraInfoCollection[]>> => {
	objectQuery = removeUndefinedOfObj(objectQuery);
	const folder = fs.readdirSync("./public");
	if (!folder.includes("topCollection.json")) {
		fs.writeFile("./public/topCollection.json", "", "utf8", () => {
			console.log(`Update top collection successfully at ${new Date(Date.now())}`);
		});
	}
	const file: any = fs.readFileSync("./public/topCollection.json");
	const topCollection: ExtraInfoCollection = JSON.parse(file)[chainId];
	const sortable = Object.entries(topCollection).filter(([, value]: any) => {
		let result: boolean = true;
		let queryKeys = Object.keys(objectQuery);
		queryKeys.forEach((key: string) => {
			result = result && value[key] === objectQuery[key];
		});
		return result;
	});
	let returnValue: any = [];
	if (sortFrom === "desc") {
		returnValue = sortable
			.sort(([, value1]: any, [, value2]: any) => value2[sortBy] - value1[sortBy])
			.reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
		console.log("1")
	} else {
		returnValue = sortable
			.sort(([, value1]: any, [, value2]: any) => value1[sortBy] - value2[sortBy])
			.reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
	}
	const result: ListResponseAPI<ExtraInfoCollection[]> = paginateArrayService(
		Object.values(returnValue),
		pageSize,
		pageId,
	);
	return result;
};

const writeTopCollectionService = async () => {
	try {
		const collections: Collection[] = await findManyService(collectionModel, { volumeTrade: { $ne: 0 } });
		let listChainId: Array<String> = collections.map(collection => collection.chainId);
		listChainId = Array.from(new Set(listChainId));
		let topCollection: any = {};
		await Promise.all(
			listChainId.map(async chainId => {
				let listCollection: any = {};
				await Promise.all(
					collections.map(async (collection: Collection) => {
						if (collection.chainId == chainId) {
							listCollection[String(collection._id)] = await getExtraInfoCollectionService(collection._id);
						}
					}),
				);
				topCollection[String(chainId)] = listCollection;
			}),
		);
		fs.writeFile("./public/topCollection.json", JSON.stringify(topCollection), "utf8", () => {
			console.log(`Update top collection successfully at ${new Date(Date.now())}`);
		});
	} catch (error: any) {
		console.log(error.message);
	}
};

const getCollectionTradeByDayService = async (
	collectionId: Types.ObjectId,
	fromDate: number,
	toDate: number,
): Promise<number> => {
	const histories = await getHistoryTradeByDayService(fromDate, toDate, {
		collectionId,
		type: 7,
	});
	let result: number = 0;
	histories.map((history: any) => {
		result += history.usdPrice;
	});
	return result;
};

const getExtraInfoCollectionService = async (collectionId: Types.ObjectId): Promise<ExtraInfoCollection> => {
	const collection = await collectionModel
		.findById(collectionId)
		.populate({ path: "ownerInfo", select: "userAddress avatar username" })
		.lean();
	//add totalItem
	let totalItem = 0;
	const countItemOfCollectionService = async () => {
		const items = await findManyService(itemModel, { collectionId: collectionId }, "owner itemMedia itemPreviewMedia");
		const trackItems: any[] = [];
		items.forEach((ele: Item) => {
			trackItems.push(ele.owner);
		});
		const mergeDedupe = [...new Set([].concat(...trackItems))];
		//get total Item
		totalItem = Number(items.length);
		return {
			itemInfo: {
				items: items,
				owners: mergeDedupe.length,
			},
		};
	};

	const getFloorPriceOfCollectionService = async () => {
		let listTransferHistories = await findManyService(
			historyModel,
			{
				collectionId: collectionId,
				type: { $eq: 7 },
			},
			"price priceType",
		);
		let priceArr: any = listTransferHistories.map((his: any) => his.price);
		if (priceArr.length === 0) {
			return {
				floorPrice: 0,
			};
		}
		priceArr.sort((a: any, b: any) => {
			return a - b;
		});
		let minPrice = priceArr[0];

		return {
			floorPrice: collection?.volumeTrade! < minPrice ? collection?.volumeTrade : minPrice,
		};
	};

	const getTradeByDay = async () => {
		const now = Date.now();
		const curDay = now - 24 * 3600 * 1000;
		const lastDay = curDay - 24 * 3600 * 1000;

		const newVolume = await getCollectionTradeByDayService(collectionId, curDay, now);
		const oldVolume = await getCollectionTradeByDayService(collectionId, lastDay, curDay);
		return {
			day: {
				volumeTradeByDay: newVolume,
				percentByDay: oldVolume > 0 ? ((newVolume - oldVolume) / oldVolume) * 100 : 0,
			},
		};
	};

	const getTradeByWeek = async () => {
		const now = Date.now();
		const curWeek = now - 7 * 24 * 3600 * 1000;
		const lastWeek = curWeek - 7 * 24 * 3600 * 1000;

		const newVolume = await getCollectionTradeByDayService(collectionId, curWeek, now);
		const oldVolume = await getCollectionTradeByDayService(collectionId, lastWeek, curWeek);

		return {
			week: {
				volumeTradeByWeek: newVolume,
				percentByWeek: oldVolume > 0 ? ((newVolume - oldVolume) / oldVolume) * 100 : 0,
			},
		};
	};

	const getTradeByMonth = async () => {
		const now = Date.now();
		const curMonth = now - 30 * 24 * 3600 * 1000;
		const lastMonth = curMonth - 30 * 24 * 3600 * 1000;

		const newVolume = await getCollectionTradeByDayService(collectionId, curMonth, now);
		const oldVolume = await getCollectionTradeByDayService(collectionId, lastMonth, curMonth);

		return {
			month: {
				volumeTradeByMonth: newVolume,
				percentByMonth: oldVolume > 0 ? ((newVolume - oldVolume) / oldVolume) * 100 : 0,
			},
		};
	};

	const obj = await multiProcessService([
		getTradeByDay(),
		getTradeByWeek(),
		getTradeByMonth(),
		countItemOfCollectionService(),
		getFloorPriceOfCollectionService(),
	]);
	const extraCollection: any = {
		...collection,
		// fix add totalItem
		listItem: obj.itemInfo.items.slice(0, totalItem),
		items: obj.itemInfo.items.length,
		owners: obj.itemInfo.owners,
		floorPrice: obj.floorPrice,
		volume24Hour: obj.day.volumeTradeByDay,
		volume7Days: obj.week.volumeTradeByWeek,
		volume30Days: obj.month.volumeTradeByMonth,
		percent24Hour: obj.day.percentByDay,
		percent7Days: obj.week.percentByWeek,
		percent30Days: obj.month.percentByMonth,
	};

	return extraCollection;
};

export const getNewCollectionService = async () => {
	const date = new Date(new Date().setDate(new Date().getDate() - Number(1)));
	const collection = await findManyService(collectionModel, {createdAt: {$gte: date}});
	return collection;
};

export const checkChainIdCollectionService = async (id: String, chainId: Number) => {
	const collection: Collection = await findOneService(collectionModel, {_id: id})
	if(Number(collection.chainId) === chainId){ 
		return true
	} else return false;
};

const getListCollectionService = async (query: object) => {
	const collections: Collection[] = await collectionModel.find(query).lean().populate("ownerInfo");
	return collections;
};

export const getAllCollectionService = async() => {
	const collection: Collection[] = await findManyService(collectionModel, {});
	return collection;
}

export const getListCollectionByCategory = async(query: object) => {
	const collections: Collection[] = await findManyService(collectionModel, query);
	return collections;
}


export { getTopCollectionService, writeTopCollectionService, getListCollectionService };

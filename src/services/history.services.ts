import historyModel from "../models/history.model";
import {
	createService,
	findOneService,
	queryExistService,
	updateOneService,
	deleteOneService,
	findManyService,
	queryItemsOfModelInPageService,
	createObjIdService,
} from "./model.services";
import { Item } from "../interfaces/item.interfaces";
import { ExtraHistory, History, HistoryTrade, minTrade } from "../interfaces/history.interfaces";
import { getOneItemService } from "./item.services";
import { ObjectId } from "mongoose";

export const getManyHistoryService = async (objQuery: any): Promise<History[]> => {
	const histories: any[] = await historyModel
		.find(objQuery)
		.lean()
		.populate({ path: "itemInfo" })
		.populate({ path: "fromUserInfo" })
		.populate({ path: "collectionInfo" })
		.sort({ createdAt: -1 });
	return histories;
};

const DEFAULT_CHAINID = process.env.DEFAULT_CHAINID || "2";

const getHistoryTradeByDayService = async (fromDate: number, toDate: number, objectQuery: any): Promise<any[]> => {
	const startDay: Date = new Date(fromDate);
	const endDay: Date = new Date(toDate);

	const histories: History[] = await getManyHistoryService({
		...objectQuery,
		createdAt: { $gte: startDay, $lte: endDay },
	});
	const tradeHistories: HistoryTrade[] = [];
	const runTask = histories.map(async (history: History) => {
		const item: Item | null = await getOneItemService({ itemId: history.itemId }, "chainId");
		const historyTrade: HistoryTrade = {
			...history,
			usdPrice: Number(history.price),
			chainId: item?.chainId || DEFAULT_CHAINID,
		};
		tradeHistories.push(historyTrade);
	});
	await Promise.all(runTask);

	return tradeHistories;
};

const getHistoryByItemService = async (itemId: string, objectQuery: any): Promise<History[]> => {
	const histories: any = historyModel
		.find({ itemId })
		.lean()
		.populate({ path: "itemInfo" })
		.populate({ path: "fromUserInfo" })
		.populate({ path: "collectionInfo" })
		.sort({ createdAt: -1 });
	return histories;
};

export const getHistoryTraderByDayService = async (fromDate: number, toDate: number, objectQuery: any) => {
	const startDay: Date = new Date(fromDate);
	const endDay: Date = new Date(toDate);
	const histories: History[] = await getManyHistoryService({
		...objectQuery,
		createdAt: { $gte: startDay, $lte: endDay },
	});
	const traderHistories: HistoryTrade[] = [];
	const runTask = histories.map(async (history: History) => {
		const item: Item | null = await getOneItemService({ itemId: history.itemId }, "chainId");
		const historyTrade: HistoryTrade = {
			...history,
			usdPrice: Number(history.price),
			chainId: item?.chainId || DEFAULT_CHAINID,
		};
		traderHistories.push(historyTrade);
	});
	await Promise.all(runTask);
	return traderHistories;
};

export const getHistoryTradeByCollectionIdService = async (collectionId: String): Promise<Number> => {
	const history: History[] = await findManyService(historyModel, { collectionId, type: 7 });
	let sum = 0;
	await Promise.all(
		history.map(async (historys: History) => {
			sum = sum + Number(historys.price);
		}),
	);
	return sum;
};

export const getMinTradeItemService = async (collectionId: String) => {
	let minTradeItem: Array<Object> = [];
	const history: History[] = await findManyService(historyModel, { collectionId, type: 6 });
	let minTrade = Math.min(...history.map((historys: History) => Number(historys.price)));
	let result: History[] = history.filter(history => Number(history.price) === Number(minTrade));
	// await Promise.all(
	result.map((historys: History) => {
		const itemIdMinTrade: String = historys.itemId.toString();
		const minValueTradeItem: any = Number(historys.price);
		minTradeItem.push({ itemIdMinTrade: itemIdMinTrade, minTradeItem: minValueTradeItem });
		console.log(minTradeItem);
	});
	return minTradeItem;
};
export const getHistoryByUserService = async (from: string, objectQuery: any): Promise<History[]> => {
	const histories: any = historyModel
		.find({ from })
		.lean()
		.populate({ path: "itemInfo" })
		.populate({ path: "fromUserInfo" })
		.populate({ path: "collectionInfo" })
		.sort({ createdAt: -1 });
	return histories;
};

export { getHistoryTradeByDayService, getHistoryByItemService };

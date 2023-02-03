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
import { ExtraHistory, History, HistoryTrade } from "../interfaces/history.interfaces";
import { getOneItemService } from "./item.services";
export const getManyHistoryService = async (objQuery: any): Promise<History[]> => {
	const histories: History[] = await findManyService(historyModel, objQuery);
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

export { getHistoryTradeByDayService };

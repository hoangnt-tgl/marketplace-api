import historyModel from "../models/history.model";
import {
	createObjIdService,
	createService,
	findManyService,
	findOneService,
	queryExistService,
} from "./model.services";
import { BigNumber } from "ethers";
import { changePriceService, fromWeiToTokenService, getManyTokenService, getTokenService } from "./price.services";
import { uploadFileToFirebaseService } from "./firebase.services";
import { TYPE_TRANSACTION } from "../constant/typeTransaction.constant";
import { getOneItemService } from "./item.services";
import { getBlacklistService } from "./user.services";
import { Types } from "mongoose";
import { DEFAULT_CHAIN_ID } from "../constant/default.constant";
import { Token } from "../interfaces/token.interfaces";
import { ExtraHistory, History, HistoryTrade } from "../interfaces/history.interfaces";
import { SortObjOutput } from "../interfaces/other.interfaces";
import { ListResponseAPI } from "../interfaces/responseData.interfaces";
import { Item } from "../interfaces/item.interfaces";
import { BlackUser } from "../interfaces/user.interfaces";
import { paginateArrayService, removeUndefinedOfObj } from "./other.services";

const createHistoryService = async (
	collectionId: Types.ObjectId,
	itemId: Types.ObjectId,
	from: string,
	to: string,
	price: string,
	priceType: string,
	quantity: number,
	txHash: string,
	type: number,
): Promise<History> => {
	const newObj = {
		collectionId,
		itemId,
		from,
		to,
		price,
		priceType,
		quantity,
		txHash,
		type,
	};
	const history: History = await createService(historyModel, newObj);

	return history;
};

const getOneHistoryService = async (objQuery: any): Promise<History> => {
	const history: History = await findOneService(historyModel, objQuery);
	return history;
};

const getManyHistoryService = async (objQuery: any): Promise<History[]> => {
	const histories: History[] = await findManyService(historyModel, objQuery);
	return histories;
};

const checkHistoryExistsService = async (queryObj: any): Promise<boolean> => {
	return await queryExistService(historyModel, queryObj);
};

const queryHistoryIdsInPageService = async (
	queryObj: any,
	pageId: number,
	pageSize: number,
	sortObj: SortObjOutput = { createdAt: -1 },
): Promise<ListResponseAPI<ExtraHistory>> => {
	const histories: History[] = await historyModel
		.find(removeUndefinedOfObj(queryObj), "_id txHash")
		.sort(sortObj)
		.lean();
	const historyReduce = histories.reduce((arr: any, cur: History) => {
		const index = arr.findIndex((e: any) => e.txHash === cur.txHash && cur.txHash !== "");
		if (index < 0) {
			arr.push({
				txHash: cur.txHash,
				histories: [cur._id],
			});
		} else {
			arr[index].histories.push(cur._id);
		}
		return arr;
	}, []);
	const returnHistories = paginateArrayService(historyReduce, pageSize, pageId);
	return returnHistories;
};

const getHistoryTradeByDayService = async (
	fromDate: number,
	toDate: number,
	objectQuery: any,
): Promise<HistoryTrade[]> => {
	const startDay: Date = new Date(fromDate);
	const endDay: Date = new Date(toDate);

	const histories: History[] = await getManyHistoryService({
		...objectQuery,
		createdAt: { $gte: startDay, $lte: endDay },
	});
	const tradeHistories: HistoryTrade[] = [];
	const runTask = histories.map(async (history: History) => {
		const item: Item = await getOneItemService({ itemId: history.itemId }, "chainId");
		const historyTrade: HistoryTrade = {
			...history,
			usdPrice: await changePriceService(history.priceType, "usd", history.price),
			chainId: item.chainId,
		};
		tradeHistories.push(historyTrade);
	});
	await Promise.all(runTask);

	return tradeHistories;
};

const returnAdditionalHistoryService = async (history: History, tokens: Token[]): Promise<ExtraHistory> => {
	const getToken = async () => {
		const token = tokens.find(token => token.tokenSymbol === history.priceType) || { decimal: 18 };
		const result = fromWeiToTokenService(history.price, token.decimal);
		return { tokenPrice: result };
	};
	const getChainId = async () => {
		return { chainId: history.itemInfo.chainId };
	};
	const obj: any = {};

	await Promise.all(
		[getToken(), getChainId()].map(async (func: any) => {
			func = await func;
			let key = Object.keys(func)[0];
			let value = Object.values(func)[0];
			obj[key] = value;
		}),
	);

	const extraHistory: ExtraHistory = {
		...history,
		chainId: obj.chainId,
		tokenPrice: obj.tokenPrice,
	};

	return extraHistory;
};

const getItemPriceChartDataService = async (itemId: string): Promise<{ date: Date, avgPrice: number }[]> => {
	const histories: History[] = await getManyHistoryService({ itemId: createObjIdService(itemId), type: [2, 3] });
	let index: number;
	const reduceByDate = histories.reduce((obj: any, cur: History) => {
		let day = cur.createdAt.getDate();
		let month = cur.createdAt.getMonth();
		let year = cur.createdAt.getFullYear();
		let date = `${year}/${month + 1}/${day}`;

		if (!obj[date]) {
			index = 0;
			obj[date] = { date: new Date(date), price: BigNumber.from(cur.price), priceType: cur.priceType, index };
		} else {
			obj[date].price = obj[date].price.add(BigNumber.from(cur.price));
		}
		obj[date].index += 1;
		return obj;
	}, {});

	const dates = Object.keys(reduceByDate);

	const priceChartArr: { date: Date, avgPrice: number }[] = [];

	await Promise.all(
		dates.map(async (date: string) => {
			let usdPrice: number = await changePriceService(
				reduceByDate[date].priceType,
				"usd",
				reduceByDate[date].price.toString(),
			);
			let data = {
				date: new Date(date + " 24:00:00"),
				avgPrice: usdPrice / reduceByDate[date].index,
			};
			priceChartArr.push(data);
		}),
	);

	const sortedPriceChart = priceChartArr.sort((a: any, b: any) => a.date - b.date);

	return sortedPriceChart;
};

const crawlTransactionOfUserService = async (
	filename: string,
	minValue: number,
	fromDate: number,
	toDate: number,
	typeTransaction: number[],
): Promise<boolean> => {
	const transactions: HistoryTrade[] = await getHistoryTradeByDayService(fromDate, toDate, { type: typeTransaction });

	const blacklist: BlackUser[] = await getBlacklistService();
	const type = typeTransaction.reduce((arr: string[], t: number) => {
		arr.push(TYPE_TRANSACTION[t]);
		return arr;
	}, []);

	const userBlacklist: string[] = blacklist.reduce((arr: string[], cur: BlackUser) => {
		if (!arr.includes(cur.userAddress)) {
			arr.push(cur.userAddress);
		}
		return arr;
	}, []);

	let totalValue = 0;

	let transactionByUser = transactions.reduce((obj: any, cur: HistoryTrade) => {
		if (!userBlacklist.includes(cur.from)) {
			totalValue += cur.usdPrice;
			if (!obj[cur.from]) {
				obj[cur.from] = {
					value: cur.usdPrice,
					chainId: cur.chainId,
					reasons: type,
				};
			} else {
				obj[cur.from].value += cur.usdPrice;
			}
		}
		return obj;
	}, {});
	transactionByUser = Object.entries(transactionByUser)
		.filter(([, values]: any) => {
			return values.value >= minValue;
		})
		.reduce((r: any[], [k, v]) => [...r, { [k]: v }], []);

	const result = await uploadFileToFirebaseService(filename, JSON.stringify(transactionByUser));

	return result;
};

const returnInfoDetailHistory = async (historyId: string): Promise<History | undefined> => {
	try {
		const history = await historyModel
			.findOne({ _id: createObjIdService(historyId) })
			.populate({ path: "itemInfo", select: "chainId itemTokenId itemMedia itemPreviewMedia itemName" })
			.populate({ path: "fromUserInfo", select: "userAddress avatar username" })
			.populate({ path: "toUserInfo", select: "userAddress avatar username" })
			.populate({ path: "collectionInfo", select: "collectionAddress" })
			.lean();
		const tokens = await getManyTokenService({ chainId: history.itemInfo.chainId });

		return returnAdditionalHistoryService(history, tokens);
	} catch (error: any) {
		console.log(error);
	}
};

export {
	createHistoryService,
	queryHistoryIdsInPageService,
	getHistoryTradeByDayService,
	getOneHistoryService,
	getManyHistoryService,
	checkHistoryExistsService,
	getItemPriceChartDataService,
	crawlTransactionOfUserService,
	returnInfoDetailHistory,
};

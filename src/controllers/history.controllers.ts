import { Request, Response } from "express";
import { ERROR_RESPONSE } from "../constant/response.constants";
import {
	crawlTransactionOfUserService,
	getItemPriceChartDataService,
	queryHistoryIdsInPageService,
	returnInfoDetailHistory,
} from "../services/history.services";

// GET Methods
const getHistoryByItemInPageController = async (req: Request, res: Response) => {
	const { itemId, pageSize, pageId } = req.params;
	const { type } = req.body;
	try {
		const history = await queryHistoryIdsInPageService({ itemId, type }, parseInt(pageId), parseInt(pageSize));
		res.status(200).json(history);
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getListHistoriesByUserAddressController = async (req: Request, res: Response) => {
	try {
		const { userAddress, pageSize, pageId } = req.params;
		const { type } = req.body;

		const listHistories = await queryHistoryIdsInPageService(
			{ $or: [{ from: userAddress }, { to: userAddress }], type },
			parseInt(pageId),
			parseInt(pageSize),
		);

		if (listHistories) {
			return res.status(200).json(listHistories);
		}
		return res.status(403).json({ error: ERROR_RESPONSE[403] });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getCollectionActivityController = async (req: Request, res: Response) => {
	try {
		const { collectionId, pageId, pageSize } = req.params;
		const { type } = req.body;

		const histories = await queryHistoryIdsInPageService({ collectionId, type }, parseInt(pageId), parseInt(pageSize));
		if (histories) {
			return res.status(200).json(histories);
		}
	} catch (error: any) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getItemPriceChartDataController = async (req: Request, res: Response) => {
	try {
		const { itemId } = req.params;
		const chart = await getItemPriceChartDataService(itemId);
		return res.status(200).json({ data: chart });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const crawlTransactionOfUserController = async (req: Request, res: Response) => {
	const { filename, minValue, fromDate, toDate, type } = req.body;
	console.log(filename, minValue, fromDate, toDate, type);
	if (!filename || !type) {
		return res.status(400).json({ error: ERROR_RESPONSE[400] });
	}
	try {
		const result = await crawlTransactionOfUserService(
			filename,
			minValue ? Number(minValue) : 0,
			fromDate ? parseInt(fromDate) : 0,
			toDate ? parseInt(toDate) : Date.now(),
			type,
		);
		if (result) {
			return res.status(200).json("Upload successful");
		}
	} catch (error: any) {
		console.log(error.message);
	}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getHistoryDetailController = async (req: Request, res: Response) => {
	try {
		const { historyId } = req.params;
		const history = await returnInfoDetailHistory(historyId);
		if (history) return res.status(200).json({ data: history });
	} catch (error: any) {
		console.log(error.message);
	}
	res.status(500).json({ error: ERROR_RESPONSE[500] });
};

export {
	getHistoryByItemInPageController,
	getListHistoriesByUserAddressController,
	getCollectionActivityController,
	getItemPriceChartDataController,
	crawlTransactionOfUserController,
	getHistoryDetailController,
};

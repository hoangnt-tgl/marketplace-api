import collectionModel from "../models/collection.model";
import itemModel from "../models/item.model";
import historyModel from "../models/history.model";
import { History } from "../interfaces/history.interfaces";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { Request, Response } from "express";
import { findManyService } from "../services/model.services";
import { getHistoryByItemService } from "../services/history.services";

const getHistoryByItemId = async (req: Request, res: Response) => {
	try {
		let { itemId } = req.params;
		let history = await getHistoryByItemService(itemId, {});
		return res.status(200).json({ data: history });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export { getHistoryByItemId };

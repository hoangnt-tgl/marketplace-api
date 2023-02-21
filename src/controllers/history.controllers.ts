import collectionModel from "../models/collection.model";
import itemModel from "../models/item.model";
import historyModel from "../models/history.model";
import { History } from "../interfaces/history.interfaces";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { Request, Response } from "express";
import { findManyService } from "../services/model.services";
import { changePricetoUSD } from "../services/changePrice.services";
import { getHistoryByItemService, getHistoryByUserService, getManyHistoryService } from "../services/history.services";

const getHistoryByItemId = async (req: Request, res: Response) => {
	try {
		let { itemId } = req.params;
		let history = await getHistoryByItemService(itemId, {});
		return res.status(200).json({ data: history });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export const getHistoryByUser = async (req: Request, res: Response) => {
	try {
		let { userAddress } = req.params;
		let history = await getHistoryByUserService(userAddress, {});
		return res.status(200).json({ data: history });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export const getHistoryByCollection = async (req: Request, res: Response) => {
	try {
		let { collectionId } = req.params;
		let history = await getManyHistoryService({ collectionId });
		return res.status(200).json({ data: history });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export const changePrice = async (req: Request, res: Response) => {
	try{
		const { fsyms } = req.query;
		if(fsyms === undefined) return res.status(400).json({ error: ERROR_RESPONSE[400] });
		let s = fsyms.toString();
		const result = await changePricetoUSD(s, 1);
		return res.status(200).json({ data: result });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}	
}
export { getHistoryByItemId };

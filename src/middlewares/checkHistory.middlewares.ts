import { Request, Response, NextFunction } from "express";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { TYPE_TRANSACTION } from "../constant/typeTransaction.constant";
import { checkHistoryExistsService } from "../services/history.services";

const checkHistoryExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const historyId = req.body.historyId || req.params.historyId;
		if (!historyId) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		const exist = await checkHistoryExistsService({ _id: historyId });
		if (!exist) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		return next();
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const checkHistoryCanCreateMiddleware = (req: Request, res: Response, next: NextFunction) => {
	try {
		const { type } = req.body || req.params;
		if (!type) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		if (!TYPE_TRANSACTION.hasOwnProperty(parseInt(type))) {
			return res.status(403).json({ error: ERROR_RESPONSE[403] });
		}
		return next();
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export { checkHistoryExistMiddleware, checkHistoryCanCreateMiddleware };

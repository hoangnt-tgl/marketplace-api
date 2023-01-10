import { Request, Response, NextFunction } from "express";
import { SymbolToName } from "../constant/token.constant";

import { ERROR_RESPONSE } from "../constant/response.constants";
import { removeFileCloundinary } from "../services/uploadFile.service"



const checkPageIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const pageId = req.params.pageId || req.body.pageId;

	try {
		if (pageId === undefined || Math.max(0, parseInt(pageId)) === 0) {
			return res.status(404).json({ error: ERROR_RESPONSE[404] });
		}

		return next();
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const checkPriceTypeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const priceType = req.body.priceType || req.body.from || req.params.from;
	try {
		if (!priceType) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		if (!SymbolToName.hasOwnProperty(priceType.toUpperCase())) {
			return res.status(403).json({ error: ERROR_RESPONSE[403] });
		}
		return next();
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export { checkPageIdMiddleware, checkPriceTypeMiddleware };

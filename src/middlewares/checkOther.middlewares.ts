import { Request, Response, NextFunction } from "express";
import { SymbolToName } from "../constant/token.constant";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { BASE_URL } from "../constant/apiAptos.constant";


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



const checkChainIdValid = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const chainId = req.params.chainId;
		if (!chainId) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		if (!Object.keys(BASE_URL).includes(chainId)) {
			return res.status(404).json({ error: ERROR_RESPONSE[404] });
		}
		next();
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export { checkPageIdMiddleware, checkChainIdValid };

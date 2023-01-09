import { Request, Response, NextFunction } from "express";
import { SymbolToName } from "../constant/token.constant";
import { MetaSpacecyAssetShared } from "../constant/contract.constant";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { removeFileCloundinary } from "../services/uploadFile.service"


const checkChainIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const chainId = req.params.chainId || req.body.chainId || req.query.chainId || req.body.network;
	//console.log("chainId: ", chainId);
	try {
		if (!chainId) {
			return res.status(404).json({ error: ERROR_RESPONSE[404] });
		}
		if (Array.isArray(chainId)) {
			for (const id of chainId) {
				if (!MetaSpacecyAssetShared.hasOwnProperty(id)) {
					return res.status(403).json({ error: ERROR_RESPONSE[403] });
				}
			}
		}
		if (!MetaSpacecyAssetShared.hasOwnProperty(chainId)) {
			return res.status(403).json({ error: ERROR_RESPONSE[403] });
		}
		return next();
	} catch (error: any) {
		if(req.body.fileBackgroundName){
			removeFileCloundinary(req.body.fileBackgroundName.toString())
			removeFileCloundinary(req.body.fileLogoName.toString())
		}	
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
	
};

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

export { checkChainIdMiddleware, checkPageIdMiddleware, checkPriceTypeMiddleware };

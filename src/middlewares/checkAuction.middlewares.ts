import { Request, Response, NextFunction } from "express";
import { getTokenService } from "../services/price.services";
import {
	checkAuctionExistService,
	getOneAuctionService,
	updateAuctionStatusService,
} from "../services/auction.services";
import { ERROR_RESPONSE } from "../constant/response.constants";
const checkCreateAuctionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { paymentToken, minPrice, endTime, bidIncreasePercent, transactionHash, startTime } = req.body;

		if (
			!paymentToken ||
			!minPrice ||
			endTime === undefined ||
			!transactionHash ||
			!startTime ||
			bidIncreasePercent === undefined
		) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		return next();
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const checkPaymentTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const chainId = req.body.chainId;
		const paymentToken = req.body.paymentToken;
		if (!paymentToken) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}

		const token = await getTokenService({ chainId, tokenAddress: paymentToken });
		const symbolToken = token.tokenSymbol;

		if (!symbolToken) {
			return res.status(403).json({ error: ERROR_RESPONSE[403] });
		}
		return next();
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const checkListItemAuctionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const items = req.body.listItemId;

		if (!items || items.length === 0) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		return next();
	} catch (error) {
		console.log(error);
	}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const checkAuctionExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const auctionId = req.params.auctionId || req.body.auctionId;
		if (!auctionId) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		const check = await checkAuctionExistService(auctionId);
		if (!check) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		return next();
	} catch (error) {
		console.log(error);
	}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const updateAuctionStatusMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await updateAuctionStatusService();
		return next();
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const checkAuctionSettleMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const auctionId = req.params.auctionId;
		const auction = await getOneAuctionService({ _id: auctionId });
		if (auction.isLive) {
			return res.status(403).json({ error: ERROR_RESPONSE[403] });
		}
		return next();
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

export {
	checkCreateAuctionMiddleware,
	checkListItemAuctionMiddleware,
	checkAuctionExistMiddleware,
	checkPaymentTokenMiddleware,
	updateAuctionStatusMiddleware,
	checkAuctionSettleMiddleware,
};

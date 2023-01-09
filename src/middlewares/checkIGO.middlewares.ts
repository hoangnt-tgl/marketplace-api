import { Request, Response, NextFunction } from "express";
import { ERROR_RESPONSE } from "../constant/response.constants";

const checkCreateIGOMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const {
		listItem,
		startTime,
		endTime,
		limitItemPerUser,
		nativeTokenName,
		nativeTokenPrice,
		protocolTokenName,
		protocolTokenPrice,
		stableTokenName,
		stableTokenPrice,
	} = req.body;
	if (!startTime || !endTime || startTime <= Date.now() || endTime <= startTime) {
		return res.status(400).json({ error: ERROR_RESPONSE[400] });
	}
	if (!nativeTokenName || !nativeTokenPrice) {
		return res.status(400).json({ error: ERROR_RESPONSE[400] });
	}
	if (!protocolTokenName || !protocolTokenPrice) {
		return res.status(400).json({ error: ERROR_RESPONSE[400] });
	}
	if (!stableTokenName || !stableTokenPrice) {
		return res.status(400).json({ error: ERROR_RESPONSE[400] });
	}
	if (!limitItemPerUser || limitItemPerUser <= 0) {
		return res.status(400).json({ error: ERROR_RESPONSE[400] });
	}
	return next();
};

export { checkCreateIGOMiddleware };

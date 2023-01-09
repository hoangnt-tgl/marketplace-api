import { Request, Response, NextFunction } from "express";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { getAdvertiseCollectionService } from "../services/advertise.service";
import { checkCollectionIsConfirmService } from "../services/collection.services";

const checkCanSetAdvertiseMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const collectionId = req.body.collectionId;
		const isConfirm = await checkCollectionIsConfirmService(collectionId);
		if (!isConfirm) {
			return res.status(403).json({ error: ERROR_RESPONSE[403] });
		}
		// if (advertise.length >= Number(process.env.MAXIMUM_ADVERTISE)) {
		// 	return res.status(400).json({ error: "Advertise quantity is maximum" });
		// }

		return next();
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export { checkCanSetAdvertiseMiddleware };

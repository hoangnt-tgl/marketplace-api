import { Request, Response, NextFunction } from "express";
import { ERROR_RESPONSE } from "../constant/response.constants";

import collectionModel from "../models/collection.model";
import { findOneService, updateOneService, createService, queryExistService } from "../services/model.services";

const checkOwnerCollection = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let { userAddress } = req.params;
		let { collectionId } = req.body || req.params;
		if (!userAddress || !collectionId) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		let existCollection = await findOneService(collectionModel, { _id: collectionId, userAddress });
		if (!existCollection) {
			return res.status(403).json({ error: ERROR_RESPONSE[403] });
		}
		next();
	} catch (error: any) {
		res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export { checkOwnerCollection };

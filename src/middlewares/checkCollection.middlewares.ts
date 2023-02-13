import { Request, Response, NextFunction } from "express";
import { ERROR_RESPONSE } from "../constant/response.constants";

import collectionModel from "../models/collection.model";
import { findOneService, updateOneService, createService, queryExistService } from "../services/model.services";

const checkOwnerCollection = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let { userAddress } = req.params;
		let collectionId = req.body.collectionId || req.params.collectionId;
		if (!userAddress || !collectionId) {
			return res.status(400).json({ error: "UserAddress or Collection ID not found" });
		}
		let existCollection = await findOneService(collectionModel, { _id: collectionId, userAddress });
		if (!existCollection) {
			return res.status(403).json({ error: "Not found Collection" });
		}
		next();
	} catch (error: any) {
		res.status(500).json({ error: "Cannot not check owner" });
	}
};
//check collection name not over 128 character
export const checkCollectionName = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let { collectionName } = req.body;
		if (collectionName.length > 128) {
			return res.status(400).json({ error: "Collection name is too long" });
		}
		next();
	} catch (error: any) {
		res.status(500).json({ error: "Cannot not check collection name" });
	}

};
//check desscription not over 1500 character
export const checkCollectionDescription = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let { description } = req.body;
		if (description.length > 1500) {
			return res.status(400).json({ error: "Collection description is too long" });
		}
		next();
	} catch (error: any) {
		res.status(500).json({ error: "Cannot not check collection description" });
	}
};

export { checkOwnerCollection };

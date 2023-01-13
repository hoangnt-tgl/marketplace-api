import { Request, Response } from "express";
import { Collection } from "../interfaces/collection.interfaces";
import collectionModel from "../models/collection.model";
import historyModel from "../models/history.model";
import { History } from "../interfaces/history.interfaces";

import { findOneService, updateOneService, createService, queryExistService, findManyService } from "../services/model.services";
import userModel from "../models/user.model";

import formidable from "formidable";
import { handlePromiseUpload } from "../services/uploadFile.service";
import { LoginUser, User } from "../interfaces/user.interfaces";
import { ResponseAPI } from "../interfaces/responseData.interfaces";
import { ERROR_RESPONSE } from "../constant/response.constants";

const createCollection = async (req: Request, res: Response) => {
	try {
		let { userAddress, chainId } = req.params;
		userAddress = userAddress.toLowerCase();
		let newCollection: Collection = req.body;
		newCollection.userAddress = userAddress;
		newCollection.chainId = chainId;
		const existCollection = await queryExistService(collectionModel, {
			userAddress,
			chainId,
			collectionName: newCollection.collectionName,
		});

		
		
		if (existCollection) return res.status(403).json({ error: ERROR_RESPONSE[403] });
		
		let collectionInfo = await createService(collectionModel, newCollection);
		let newHistory = {
			collectionId: collectionInfo._id,
			from: userAddress,
			to: req.body.to,
			type: 1,
			txHash: req.body.txHash,
		}
		createService(historyModel, newHistory)
		
		return res.status(200).json({ data: collectionInfo });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getCollectionById = async (req: Request, res: Response) => {
	try {
		let { collectionId } = req.params;
		let collectionInfo = await findOneService(collectionModel, { _id: collectionId });
		return res.status(200).json({ data: collectionInfo });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getCollectionByUserAddress = async (req: Request, res: Response) => {
	try {
		let { userAddress, chainId } = req.params;
		userAddress = userAddress.toLowerCase();
		let collectionInfo = await findManyService(collectionModel, { userAddress, chainId });
		return res.status(200).json({ data: collectionInfo });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export { createCollection, getCollectionById, getCollectionByUserAddress };

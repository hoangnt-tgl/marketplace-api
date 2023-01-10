import { Request, Response } from "express";
import { Collection } from "../interfaces/collection.interfaces";
import collectionModel from "../models/collection.model";

import {
	createUserIfNotExistService,
	getManyUserService,
	getOneUserService,
	getSearchUserByIdService,
	updateUserService,
	updateNonceUserService,
} from "../services/user.services";
import { findOneService, updateOneService, createService, queryExistService } from "../services/model.services";
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

export { createCollection, getCollectionById };

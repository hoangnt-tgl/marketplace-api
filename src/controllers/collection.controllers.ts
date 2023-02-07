import { Request, Response } from "express";
import { Collection } from "../interfaces/collection.interfaces";
import collectionModel from "../models/collection.model";
import itemModel from "../models/item.model";
import historyModel from "../models/history.model";
import { History } from "../interfaces/history.interfaces";

import {
	findOneService,
	updateOneService,
	createService,
	queryExistService,
	findManyService,
} from "../services/model.services";
import { getAllItemService } from "../services/item.services";
import userModel from "../models/user.model";

import formidable from "formidable";
import { handlePromiseUpload } from "../services/uploadFile.service";
import { LoginUser, User } from "../interfaces/user.interfaces";
import { ResponseAPI } from "../interfaces/responseData.interfaces";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { promises } from "fs";
import { async } from "@firebase/util";
import {
	getTopCollectionService,
	getNewCollectionService,
	getListCollectionService,
	getListCollectionByCategory,
} from "../services/collection.services";
import { CATEGORY } from "../constant/collection.constant";
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
		};
		createService(historyModel, newHistory);

		return res.status(200).json({ data: collectionInfo });
	} catch (error: any) {
		return res.status(500).json({ error: "Cannot Create Collection" });
	}
};

const getCollectionById = async (req: Request, res: Response) => {
	try {
		let { collectionId } = req.params;
		let collectionInfo = await findOneService(collectionModel, { _id: collectionId });
		if (!collectionInfo) return res.status(404).json({ error: ERROR_RESPONSE[404] });
		let items = await getAllItemService({ collectionId: collectionInfo._id });
		collectionInfo.listItem = items;
		return res.status(200).json({ data: collectionInfo });
	} catch (error: any) {
		return res.status(500).json({ error: "Cannot get Collection" });
	}
};

const getCollectionByUserAddress = async (req: Request, res: Response) => {
	try {
		let { userAddress, chainId } = req.params;
		userAddress = userAddress.toLowerCase();
		let collectionInfo = await findManyService(collectionModel, { userAddress, chainId });
		await Promise.all(
			collectionInfo.map(async (collection: any, index: number) => {
				let items = await findManyService(itemModel, { collectionId: collection._id });
				collectionInfo[index].listItem = items;
			}),
		);
		return res.status(200).json({ data: collectionInfo });
	} catch (error: any) {
		return res.status(500).json({ error: "Cannot get Collection" });
	}
};

const getCollectionByCategory = async (req: Request, res: Response) => {
	try {
		let { category, chainId } = req.params;
		let collections: Collection[] = await getListCollectionService({ category, chainId });
		await Promise.all(
			collections.map(async (collection: any, index: number) => {
				let items = await findManyService(itemModel, { collectionId: collection._id });
				collections[index].listItem = items;
			}),
		);
		return res.status(200).json({ data: collections });
	} catch (error: any) {
		return res.status(500).json({ error: "Cannot get Collection" });
	}
};

const getAllCollection = async (req: Request, res: Response) => {
	try {
		let { chainId } = req.params;
		let collections: Collection[] = await getListCollectionService({ chainId });
		await Promise.all(
			collections.map(async (collection: any, index: number) => {
				let items = await findManyService(itemModel, { collectionId: collection._id });
				collections[index].listItem = items;
			}),
		);
		return res.status(200).json({ data: collections });
	} catch (error: any) {
		return res.status(500).json({ error: "Cannot get all Collection" });
	}
};

const getTopCollection = async (req: Request, res: Response) => {
	try {
		const sortBy:
			| "volumeTrade"
			| "floorPrice"
			| "volume24Hour"
			| "volume7Days"
			| "volume30Days"
			| "percent24Hour"
			| "percent7Days"
			| "percent30Days" = req.body.sortBy;
		const sortFrom: "desc" | "asc" = req.body.sortFrom;
		const { pageSize, pageId, chainId } = req.params;
		const { userAddress, collectionName, collectionStandard, category }: Collection = req.body;
		const objectQuery = {
			userAddress,
			collectionName,
			collectionStandard,
			category,
		};
		const collections = await getTopCollectionService(
			sortBy,
			sortFrom,
			objectQuery,
			Number(pageSize),
			Number(pageId),
			chainId,
		);

		return res.status(200).json(collections);
	} catch (error: any) {
		return res.status(500).json({ error: "Cannot get top collection" });
	}
};

export const getNewCollectionController = async (req: Request, res: Response) => {
	try {
		const collection = await getNewCollectionService();
		return res.status(200).json(collection);
	} catch (error: any) {
		return res.status(500).json({ error: "Cannot get new Collection" });
	}
};

export const getAllCollectionByCategory = async (req: Request, res: Response) => {
	try {
		let chainId = Number(req.params.chainId);
		// let categoryCollection: {category: String, collection: Collection[]}[] = [];
		let categoryCollection: any = {};
		categoryCollection["All"] = [];
		for (let i = 1; i < 9; i++) {
			let category = Number(CATEGORY[i].key);
			let collections: Collection[] = await getListCollectionService({ category, chainId });
			await Promise.all(
				collections.map(async (collection: any, index: number) => {
					let items = await findManyService(itemModel, { collectionId: collection._id });
					collections[index].listItem = items;
				}),
			);
			if (collections.length > 0) {
				categoryCollection["All"] = categoryCollection["All"].concat(collections);
				categoryCollection[CATEGORY[i].type] = collections;
			}
		}
		return res.status(200).json({ data: categoryCollection });
	} catch (error: any) {
		return res.status(500).json({ error: "Cannot get all Collection" });
	}
};

export {
	createCollection,
	getCollectionById,
	getCollectionByUserAddress,
	getCollectionByCategory,
	getAllCollection,
	getTopCollection,
};

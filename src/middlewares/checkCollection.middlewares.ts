import { Request, Response, NextFunction } from "express";
import { createObjIdService } from "../services/model.services";
import { MetaSpacecyAssetShared } from "../constant/contract.constant";

import {
	checkCollectionExistsByIdService,
	checkCollectionExistsService,
	checkCollectionIsConfirmService,
	checkIsOwnerOfCollectionService,
	getOneCollectionService,
} from "../services/collection.services";
import { Collection } from "../interfaces/collection.interfaces";
import { ChainId } from "../interfaces/other.interfaces";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { removeFileCloundinary } from "../services/uploadFile.service"

const checkCollectionExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const collectionId: string = req.body.collectionId || req.params.collectionId;
		if (collectionId) {
			const exist: boolean = await checkCollectionExistsByIdService(collectionId);
			if (exist) {
				return next();
			}
		} else {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
	} catch (error: any) {
		console.log(error.message);
	}
	return res.status(404).json({ error: ERROR_RESPONSE[404] });
};

const checkCollectionNameExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { chainId, collectionName }: { chainId: ChainId, collectionName: string } = req.body;
		const { collectionId } = req.params;
		const collection: Collection = await getOneCollectionService({ _id: createObjIdService(collectionId) });
		if (collectionName !== collection.collectionName) {
			if (collectionName) {
				const collectionAddress = MetaSpacecyAssetShared[chainId];
				const exist = await checkCollectionExistsService(chainId, collectionAddress, collectionName);
				if (exist) {
					return res.status(403).json({ error: ERROR_RESPONSE[403] });
				}
			}
		}
		return next();
	} catch (error: any) {
		return res.status(404).json({ error: ERROR_RESPONSE[404] });
	}
};

const checkCollectionCanCreateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { chainId, royalties, logo, background, collectionName, collectionStandard, description }: Collection =
			req.body;
		if (
			!collectionStandard || 
			!collectionName || 
			royalties === undefined ||
			!logo ||
			!background ||
			!description
		) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		// if (!collectionName) {
		// 	return res.status(400).json({ error: ERROR_RESPONSE[400] });
		// }
		// if (royalties === undefined) {
		// 	return res.status(400).json({ error: ERROR_RESPONSE[400] });
		// }
		// if (!logo) {
		// 	return res.status(400).json({ error: ERROR_RESPONSE[400] });
		// }
		// if (!background) {
		// 	return res.status(400).json({ error: ERROR_RESPONSE[400] });
		// }
		// if (!description) {
		// 	return res.status(400).json({ error: ERROR_RESPONSE[400] });
		// }

		const collectionAddress: string = MetaSpacecyAssetShared[chainId];
		const checkName: boolean = await checkCollectionExistsService(chainId, collectionAddress, collectionName);
		if (checkName) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		return next();
	} catch (error: any) {
		if(req.body.fileBackgroundName){
			removeFileCloundinary(req.body.fileBackgroundName.toString())
			removeFileCloundinary(req.body.fileLogoName.toString())
		}	
		return res.status(404).json({ error: ERROR_RESPONSE[404] });
	}
};

const checkCollectionCanUpdateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userAddress: string = req.body.userAddress;
		const collectionId: string = req.params.collectionId;
		const isConfirm: boolean = await checkCollectionIsConfirmService(createObjIdService(collectionId));
		const isOwner: boolean = await checkIsOwnerOfCollectionService(collectionId, userAddress);
		if (isConfirm && isOwner) {
			return next();
		}
		return res.status(403).json({ error: ERROR_RESPONSE[403] });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const checkCreatorCollectionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const creator: string = req.params.creator || req.body.creator;
		const collectionId: string = req.params.collectionId || req.body.collectionId;
		const isCreator: boolean = await checkIsOwnerOfCollectionService(collectionId, creator.toLowerCase());
		if (!isCreator) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		return next();
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export {
	checkCollectionExistMiddleware,
	checkCollectionCanUpdateMiddleware,
	checkCollectionCanCreateMiddleware,
	checkCreatorCollectionMiddleware,
	checkCollectionNameExistMiddleware,
};

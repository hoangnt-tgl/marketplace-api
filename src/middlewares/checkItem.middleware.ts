import { Request, Response, NextFunction } from "express";
import { createObjIdService, findOneService } from "../services/model.services";
import itemModel from "../models/item.model";
import historyModel from "../models/history.model";
import { checkIsBaseCollectionService } from "../services/collection.services";
import {
	checkIsBaseItemService,
	checkItemExistsService,
	checkItemIsFreezeService,
	checkCreatorItemService,
	checkOwnerItemService,
} from "../services/item.services";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { getSearchItemByIdService, getItemsByCollectionService } from "../services/item.services"
import { Item } from "../interfaces/item.interfaces";

const checkItemExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const itemId = req.params.itemId || req.body.itemId || req.body.boxId;
		if (!itemId) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		const exist = await checkItemExistsService({ _id: createObjIdService(itemId) });
		if (!exist) {
			return res.status(404).json({ error: ERROR_RESPONSE[404] });
		}
		return next();
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const checkItemCanUpdateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const itemId = req.body.itemId || req.params.itemId;
		const userAddress = req.body.userAddress || req.params.userAddress;
		const isFreeze = await checkItemIsFreezeService(itemId);
		const isBaseItem = await checkIsBaseItemService(itemId);
		const isCreator = await checkCreatorItemService(itemId, userAddress);

		if (isFreeze) {
			return res.status(403).json({ error: ERROR_RESPONSE[403] });
		}
		if (!isBaseItem) {
			return res.status(403).json({ error: ERROR_RESPONSE[403] });
		}
		if (!isCreator) {
			return res.status(403).json({ error: ERROR_RESPONSE[403] });
		}

		return next();
	} catch (error) {
		console.log(error);
	}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const checkItemCanCreateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const collectionId = req.params.collectionId || req.body.collectionId;
	const chainId = req.params.chainId || req.body.chainId;
	const quantity = req.body.quantity;
	try {
		const isBaseCollection = await checkIsBaseCollectionService(chainId, collectionId);
		if (!isBaseCollection) {
			return res.status(403).json({ error: ERROR_RESPONSE[403] });
		}
		if (quantity) {
			if (quantity > 1099511627775 || quantity <= 0) {
				return res.status(403).json({ error: ERROR_RESPONSE[403] });
			}
		}
		return next();
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const checkOwnerItemMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const owner = req.params.owner || req.body.owner;
	const itemId = req.params.itemId || req.body.itemId;
	const type = req.body.type;
	try {
		if (type !== 0 && type !== 1) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		if (type === 0) {
			const isOwnerItem = await checkOwnerItemService(owner, itemId);
			if (!isOwnerItem) return res.status(403).json({ error: ERROR_RESPONSE[403] });
		}
		return next();
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const checkItemSelling = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const itemId = req.params.itemId || req.body.itemId;
		const type = req.params.type || req.body.type;
		const item = await findOneService(itemModel, { _id: itemId });
		if (item.status === 1 && type === 0) return res.status(403).json({ error: ERROR_RESPONSE[403] });
		else return next();
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const checkHistoryExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const historyId = req.params.historyId || req.body.historyId;
		const history = await findOneService(historyModel, { _id: historyId });
		if (!history)return res.status(404).json({ error: ERROR_RESPONSE[404] });
		else return next();
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};
/*------------@Dev:Huy-----------------*/
const checkItemInCollection = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const itemId = req.params.itemId || req.body.itemId || req.query.itemId;
		const collectionId = req.params.collectionId || req.body.collectionId || req.query.collectionId;
		if(!getSearchItemByIdService(itemId)){
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		} else {
			let item: Item[] = await getItemsByCollectionService(collectionId);
			await Promise.all(
				item.map(async (item: any) => {
					if(item._id.toString() === itemId){
						return next();
					}
				})
			)
			return res.status(404).json({ error: ERROR_RESPONSE[404] });
		}

	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
}

export {
	checkItemCanUpdateMiddleware,
	checkItemExistMiddleware,
	checkItemCanCreateMiddleware,
	checkOwnerItemMiddleware,
	checkItemSelling,
	checkHistoryExistMiddleware,
/*------------@Dev:Huy-----------------*/
	checkItemInCollection,
};

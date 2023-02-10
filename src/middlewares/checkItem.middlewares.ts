import { Request, Response, NextFunction } from "express";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { createObjIdService } from "../services/model.services";
import { checkItemExistsService } from "../services/item.services";

const checkItemExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const itemId = req.params.itemId || req.body.itemId || req.body.boxId;
		if (!itemId) {
			return res.status(400).json({ error: "Not found Item ID" });
		}
		const exist = await checkItemExistsService({ _id: createObjIdService(itemId) });
		if (!exist) {
			return res.status(404).json({ error: "Not found Item" });
		}
		return next();
	} catch (error: any) {
		return res.status(500).json({ error: "Cannot check Item" });
	}
};

export { checkItemExistMiddleware };

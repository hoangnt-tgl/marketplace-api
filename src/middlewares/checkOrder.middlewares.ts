import { Request, Response, NextFunction } from "express";
import { findOneService } from "../services/model.services";
import orderModel from "../models/Order.model";
import { ERROR_RESPONSE } from "../constant/response.constants";

const checkMakerOrderMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const maker = req.params.maker || req.body.maker;
	if (!maker) return res.status(404).json({ error: ERROR_RESPONSE[404] });

	try {
		const findMaker = await findOneService(orderModel, { maker });
		if (findMaker) {
			return next();
		}
		return res.status(404).json({ error: ERROR_RESPONSE[404] });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const checkOrderMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const orderId = req.params.orderId || req.body.orderId || req.params.id || req.body.id;

		if (!orderId) return res.status(400).json({ error: ERROR_RESPONSE[400] });
		const order = await findOneService(orderModel, { _id: orderId });

		if (order) return next();
		return res.status(404).json({ error: ERROR_RESPONSE[404] });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};
export { checkMakerOrderMiddleware, checkOrderMiddleware };

import { Request, Response, NextFunction } from "express";
import { queryExistService } from "../services/model.services";
import UserModel from "../models/user.model";
import { ERROR_RESPONSE } from "../constant/response.constants";

export const checkUserExist = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let userAddress = 
			req.body.userAddress || 
			req.params.userAddress || 
			req.query.userAddress;
		userAddress = userAddress.toLowerCase();
		if (!userAddress) {
			return res.status(400).json({ error: "Not found UserAddress" });
		}
		const exist = await queryExistService(UserModel, { userAddress });
		if (!exist) {
			return res.status(404).json({ error: "User not found" });
		}
		return next();
	} catch (error: any) {
		return res.status(500).json({ error: "Cannot check User" });
	}
};

export const checkUserAddressValid = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let { userAddress } = req.body;
		if (userAddress.length !== 66) 
		return res.status(400).json({ error: ERROR_RESPONSE[400] });
		next(); 
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
}



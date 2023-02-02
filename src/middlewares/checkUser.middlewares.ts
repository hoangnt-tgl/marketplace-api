import { Request, Response, NextFunction } from "express";
import { queryExistService } from "../services/model.services";
import UserModel from "../models/user.model";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { checkUserExistsService, getOneUserService, verifySignUserService } from "../services/user.services";

export const checkUserExist = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let { userAddress } = req.params;
		userAddress = userAddress.toLowerCase();
		if (!userAddress) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		const exist = await queryExistService(UserModel, { userAddress });
		if (!exist) {
			return res.status(404).json({ error: ERROR_RESPONSE[404] });
		}
		return next();
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export const checkUserAuthen = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userAddress = req.body.userAddress || req.params.userAddress;
		const { publicKey, nonce, signature } = req.body;
		const cookies = req.cookies;
		if (cookies.signature && cookies.publicKey) {
			const userExist = await checkUserExistsService(userAddress);
			if (userExist) {
				const user = await getOneUserService(userAddress);
				const isValid = verifySignUserService(cookies.publicKey, user.nonce, cookies.signature);
				if (isValid) {
					req.body.isFirst = false;
					return next();
				}
			}
		} else {
			console.log("body:", req.body);
			const isValid = verifySignUserService(publicKey, nonce, signature);
			if (isValid) {
				req.body.isFirst = true;
				return next();
			}
		}
		return res.status(401).json({ error: ERROR_RESPONSE[401] });
	} catch (error: any) {
		return res.status(401).json({ error: ERROR_RESPONSE[401] });
	}
};

export const checkUserAddressValid = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let { userAddress } = req.body;
		if (userAddress.length !== 66) return res.status(400).json({ error: ERROR_RESPONSE[400] });
		next();
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

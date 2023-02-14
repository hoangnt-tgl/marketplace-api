import { Request, Response, NextFunction } from "express";
import { queryExistService } from "../services/model.services";
import UserModel from "../models/user.model";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { checkUserExistsService, getOneUserService, verifySignUserService } from "../services/user.services";
import { encodeJwt, decodeJwt } from "../services/other.services";

export const checkUserExist = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let userAddress = req.body.userAddress || req.params.userAddress || req.query.userAddress;
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

export const checkUserAuthen = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userAddress = req.body.userAddress || req.params.userAddress;
		const { publicKey, nonce, signature } = req.body;
		if (publicKey && nonce && signature) {
			const isValid = verifySignUserService(publicKey, nonce, signature);
			if (isValid) {
				const token = encodeJwt({ publicKey, nonce, signature, userAddress }, "1d");
				req.body.token = token;
				return next();
			}
		} else if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
			const userExist = await checkUserExistsService(userAddress);
			if (!userExist) return res.status(401).json({ error: ERROR_RESPONSE[401] });
			const token = req.headers.authorization.split(" ")[1];
			const decode = decodeJwt(token);
			if (userAddress !== decode.userAddress) return res.status(401).json({ error: ERROR_RESPONSE[401] });
			if (decode) {
				const isValid = verifySignUserService(decode.publicKey, decode.nonce, decode.signature);
				if (isValid) {
					return next();
				}
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

export const checkBioUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { bio } = req.body;
		if (bio.length > 1500) return res.status(400).json({ error: ERROR_RESPONSE[400] });
		next();
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

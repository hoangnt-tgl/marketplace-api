import { Request, Response, NextFunction } from "express";
import { findOneService, updateOneService } from "../services/model.services";
import userModel from "../models/user.model";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { removeFileCloundinary } from "../services/uploadFile.service"

const checkSignatureValid = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userAddress = req.params.userAddress || req.body.userAddress;
		const user = await findOneService(userModel, { userAddress: userAddress.toLowerCase() });
		if (user && user.signature.length > 0) {
			const isSignatureExpired = checkSignatureExpired(user);
			if (isSignatureExpired) return res.status(401).json({ error: ERROR_RESPONSE[401] });
			else return next();
		} else return next();
	} catch (error: any) {
		if(req.body.fileBackgroundName){
			removeFileCloundinary(req.body.fileBackgroundName.toString())
			removeFileCloundinary(req.body.fileLogoName.toString())
		}	
		console.log(error);
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};


const checkSignatureExpired = (user: any) => {
	const dateToMS = 86400;
	const expired_signature = Number(user.signature_expired_time);
	const remainingTime = Math.floor(Date.now() / 1000) - expired_signature;
	return remainingTime > dateToMS ? true : false;
};

const refreshSignature = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const signature = req.body.signature;
		const userAddress = req.params.userAddress || req.body.userAddress;
		const user = await findOneService(userModel, { userAddress: userAddress.toLowerCase() });
		if (user && checkSignatureExpired(user)) {
			const new_signature_expired_time: string = Math.floor(Date.now() / 1000).toString();
			await updateOneService(
				userModel,
				{ userAddress: userAddress.toLowerCase() },
				{
					signature,
					signature_expired_time: new_signature_expired_time,
				},
			);
		}
		return next();
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export { refreshSignature, checkSignatureValid };

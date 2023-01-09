import { Request, Response } from "express";
import {
	createUserIfNotExistService,
	getManyUserService,
	getOneUserService,
	getSearchUserByIdService,
	updateUserService,
	updateNonceUserService,
} from "../services/user.services";
import { findOneService, updateOneService } from "../services/model.services";
import userModel from "../models/user.model";
import { getManyItemService, getSearchItemByIdService } from "../services/item.services";
import formidable from "formidable";
import { handlePromiseUpload } from "../services/uploadFile.service";
import { LoginUser, User } from "../interfaces/user.interfaces";
import { ResponseAPI } from "../interfaces/responseData.interfaces";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { Item } from "../interfaces/item.interfaces";


const createUserController = async (req: Request, res: Response) => {
	let { userAddress, signature } = req.body;

	try {
		userAddress = userAddress.toLowerCase();
		const user: User = await createUserIfNotExistService(userAddress, signature);
		const items = await getManyItemService({ owner: userAddress }, "_id");
		if (!items) return res.status(403).json({ error: ERROR_RESPONSE[403] });
		const data: LoginUser = {
			...user,
			totalItems: items.length,
		};
		const response: ResponseAPI<LoginUser> = {
			data,
		};
		return res.status(200).json(response);
	} catch (error: any) {
		return res.status(403).json({ error: ERROR_RESPONSE[403] });
	}
	
};

const createUserController1 = async (req: Request, res: Response) => {
	try {
		
		let { userAddress, signature, nonce} = req.body;
		await res.cookie('signature', signature, { domain: '.metaspacecy.com', path: '/', expires: new Date(Date.now() + 3600000)})
		await updateNonceUserController(userAddress, nonce)
		const user: User = await createUserIfNotExistService(userAddress, nonce);
		const items = await getManyItemService({ owner: userAddress }, "_id");
		if (!items) return res.status(403).json({ error: ERROR_RESPONSE[403] });
		const data: LoginUser = {
			...user,
			totalItems: items.length,
		};
		const response: ResponseAPI<LoginUser> = {
			data,
		};
		return res.status(200).json(response);
	} catch (error: any) {
		return res.status(403).json({ error: ERROR_RESPONSE[403] });
	}
};
const cookie = async (req: Request, res: Response) => {
	await res.cookie('signature', "Done", { domain: 'http://192.168.0.128:3001', path: '/',httpOnly: true, expires: new Date(Date.now() + 3600000)})
	return res.status(200).json("Done");
}

const uploadUserImageController = async (req: Request, res: Response) => {
	try {
		const form = formidable();
		const result = await handlePromiseUpload(form, req, "users");

		return res.status(200).json({ data: result });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const updateUserController = async (req: Request, res: Response) => {
	const userAddress = req.params.userAddress;
	const { avatar, background, username, email, social, bio } = req.body;
	const avatarURL = avatar.result;
	const backgroundURL = background.result;
	try {
		const user = await updateUserService(userAddress, avatarURL, backgroundURL, username, email, social, bio);
		return res.status(200).json({ data: user });
	} catch (error: any) {}
	return res.status(500).json({ error: ERROR_RESPONSE[403] });
};

const updateNonceUserController = async (userAddress: string, nonce: string) => {
		await updateNonceUserService(userAddress, nonce);
};

const logoutController = async (req: Request, res: Response) => {
	try {
		const { userAddress } = req.body;
		const user = await findOneService(userModel, { userAddress });
		if (user.signature) {
			await updateOneService(userModel, { userAddress }, { signature: "" });
		}
		return res.status(200).json({ message: "Logout successfully" });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getUserProfileController = async (req: Request, res: Response) => {
	try {
		const { userAddress } = req.params;
		const user = await getOneUserService(userAddress);
		const totalItems = await getManyItemService({ owner: userAddress }, "_id");
		if (user) res.status(200).json({ data: { ...user, totalItems: totalItems.length } });
		else res.status(403).json({ message: ERROR_RESPONSE[403] });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getQueryUserController = async (req: Request, res: Response) => {
	const { pageSize, pageId } = req.params;
	try {
		const textSearch = req.body.text;
		
		const sort = req.body.sort;

		const users = await getManyUserService(textSearch, sort, parseInt(pageSize), parseInt(pageId));
		
		if (users) res.status(200).json(users);
		else res.status(403).json({ message: ERROR_RESPONSE[403] });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getSearchUserByIdController = async (req: Request, res: Response) => {
	const { userId } = req.params;
	try {
		const user: User = await getSearchUserByIdService(userId);
		const response: ResponseAPI<User> = {
			data: user,
		};
		return res.status(200).json(response);
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export {
	createUserController,
	updateUserController,
	logoutController,
	getUserProfileController,
	uploadUserImageController,
	getQueryUserController,
	getSearchUserByIdController,
	cookie 

};

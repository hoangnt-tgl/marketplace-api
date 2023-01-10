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
import { createService } from "../services/model.services";
import formidable from "formidable";
import { handlePromiseUpload } from "../services/uploadFile.service";
import { LoginUser, User } from "../interfaces/user.interfaces";
import { ResponseAPI } from "../interfaces/responseData.interfaces";
import { ERROR_RESPONSE } from "../constant/response.constants";

const createUserController = async (req: Request, res: Response) => {
	try {
		let { userAddress, signature } = req.body;
		userAddress = userAddress.toLowerCase();

		const user: User = await createUserIfNotExistService(userAddress, signature);

		return res.status(200).json({ data: user });
	} catch (error: any) {
		return res.status(403).json({ error: ERROR_RESPONSE[403] });
	}
};

const cookie = async (req: Request, res: Response) => {
	await res.cookie("signature", "Done", {
		domain: "http://192.168.0.128:3001",
		path: "/",
		httpOnly: true,
		expires: new Date(Date.now() + 3600000),
	});
	return res.status(200).json("Done");
};

const uploadUserImageController = async (req: Request, res: Response) => {
	try {
		const form = formidable();
		const result = await handlePromiseUpload(form, req, "users");
		return res.status(200).json({ data: result });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getUserProfileController = async (req: Request, res: Response) => {
	try {
		const { userAddress } = req.params;
		const user = await getOneUserService(userAddress);

		if (user) res.status(200).json({ data: { ...user } });
		else res.status(403).json({ message: ERROR_RESPONSE[403] });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};
const updateUserController = async (req: Request, res: Response) => {
	const userAddress = req.params.userAddress;
	const { avatar, background, username, email, social, bio } = req.body;
	const avatarURL = avatar.data.result;
	const backgroundURL = background.data.result;
	console.log(avatarURL, backgroundURL);
	try {
		const user = await updateUserService(userAddress, avatarURL, backgroundURL, username, email, social, bio);
		return res.status(200).json({ data: user });
	} catch (error: any) {}
	return res.status(500).json({ error: ERROR_RESPONSE[403] });
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
	uploadUserImageController,
	getQueryUserController,
	getSearchUserByIdController,
	cookie,
	getUserProfileController,
};

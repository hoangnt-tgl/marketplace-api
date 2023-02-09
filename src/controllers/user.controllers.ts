import { Request, Response } from "express";
import {
	createUserIfNotExistService,
	getManyUserService,
	getOneUserService,
	getSearchUserByIdService,
	updateUserService,
	getAllUsersService,
	topTraderService,
} from "../services/user.services";
import { getManyHistoryService } from "../services/history.services";
import { findOneService, updateOneService } from "../services/model.services";
import userModel from "../models/user.model";
import { createService } from "../services/model.services";
import { removeUndefinedOfObj } from "../services/other.services";
import formidable from "formidable";
import { handlePromiseUpload } from "../services/uploadFile.service";
import { LoginUser, User } from "../interfaces/user.interfaces";
import { ResponseAPI } from "../interfaces/responseData.interfaces";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { sendMailService } from "../services/mail.services";
import { STATIC_FOLDER } from "../constant/default.constant";
import jwt from "jsonwebtoken";
import fs from "fs";

const createUserController = async (req: Request, res: Response) => {
	try {
		let { userAddress, signature, publicKey, nonce, isFirst } = req.body;
		userAddress = userAddress.toLowerCase();

		if (true) {
			const user: User = await createUserIfNotExistService(userAddress, nonce);
			const { nonce: _, ...data } = user;

			req.session.user = {
				signature,
				publicKey,
			};

			return res.status(200).json({ data: data });
		} else {
			const user: User = await getOneUserService(userAddress);
			const { nonce: _, ...data } = user;
			return res.status(200).json({ data: data });
		}
	} catch (error: any) {
		return res.status(403).json({ error: "Cannot Create User" });
	}
};

const uploadUserImageController = async (req: Request, res: Response) => {
	try {
		const form = formidable();
		const result = await handlePromiseUpload(form, req, "users");
		return res.status(200).json({ data: result });
	} catch (error: any) {
		return res.status(500).json({ error: "Cannot Upload Image" });
	}
};

const updateUserController = async (req: Request, res: Response) => {
	try {
		const { userAddress } = req.params;
		let data: User = req.body;
		data = removeUndefinedOfObj(data);
		const user = await updateOneService(userModel, { userAddress }, data);
		if (data.email && (!user.confirmEmail || user.email !== data.email)) {
			let html = fs.readFileSync(`${STATIC_FOLDER}/views/verificationEmail.html`, { encoding: "utf8" });
			let token = jwt.sign({ userAddress }, "secret", { expiresIn: "10m" });
			token = encodeURIComponent(token);
			let host = req.headers.host?.includes("localhost") ? "http://" : "https://";
			host += req.headers.host;
			let link = `${host}/users/verify-email/${userAddress}/${token}`;
			html = html.replace("{{link}}", link);
			await sendMailService(data.email, "Verify your email", html);
		}
		return res.status(200).json({ data: user });
	} catch (error: any) {
		return res.status(500).json({ error: "Cannot Update User" });
	}
};

const verificationEmailController = async (req: Request, res: Response) => {
	try {
		let { userAddress, token } = req.params;
		userAddress = userAddress.toLowerCase();
		token = decodeURIComponent(token);
		const user = await findOneService(userModel, { userAddress });
		if (!user) return res.status(403).json({ error: "Not Found User" });
		const decoded = jwt.verify(token, "secret");
		if (decoded) {
			await updateOneService(userModel, { userAddress }, { confirmEmail: true });
			return res.status(200).json({ message: "Verify email successfully" });
		}
		return res.status(403).json({ error: ERROR_RESPONSE[403] });
	} catch (error: any) {
		return res.status(500).json({ error: "Cannot Verify Email" });
	}
};

const logoutUserController = async (req: Request, res: Response) => {
	try {
		const { userAddress } = req.body;
		await updateOneService(userModel, { userAddress }, { nonce: null });
		req.session.destroy(() => {});
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

export const topTraderController = async (req: Request, res: Response) => {
	try {
		const request = req.query.request;
		const chainId = req.params.chainId;
		return res.status(200).json(await topTraderService(Number(request), Number(chainId)));
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getUserProfileController = async (req: Request, res: Response) => {
	try {
		const { userAddress } = req.params;
		const user = await findOneService(userModel, { userAddress });
		return res.status(200).json({ data: user });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export {
	createUserController,
	updateUserController,
	uploadUserImageController,
	verificationEmailController,
	logoutUserController,
	getUserProfileController,
};

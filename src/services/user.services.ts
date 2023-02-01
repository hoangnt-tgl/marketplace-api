import userModel from "../models/user.model";
import nacl from "tweetnacl";
import {
	createService,
	findOneService,
	queryExistService,
	updateOneService,
	deleteOneService,
	findManyService,
	queryItemsOfModelInPageService,
	createObjIdService,
} from "./model.services";
import blacklistModel from "../models/blacklist.model";
import { getSortObj } from "./other.services";
import { BlackUser, User } from "../interfaces/user.interfaces";
import { ListResponseAPI } from "../interfaces/responseData.interfaces";

const createUserIfNotExistService = async (userAddress: string, nonce: number): Promise<User> => {
	let user: User = await findOneService(userModel, { userAddress });
	if (!user) {
		user = await createService(userModel, { userAddress, nonce });
	} else {
		await updateOneService(userModel, { userAddress }, { nonce });
	}
	return user;
};

const checkUserExistsService = async (userAddress: string): Promise<boolean> => {
	userAddress = userAddress.toLowerCase();
	return await queryExistService(userModel, { userAddress });
};

const getOneUserService = async (userAddress: string): Promise<User> => {
	let user: User = await findOneService(userModel, { userAddress: userAddress.toLowerCase() });
	return user;
};

const getManyUserService = async (
	text: string,
	sort: string[],
	pageSize: number,
	pageId: number,
): Promise<ListResponseAPI<User>> => {
	const userAddress: any = text ? { userAddress: { $regex: text, $options: "i" } } : undefined;
	const username: any = text ? { username: { $regex: text, $options: "i" } } : undefined;

	const objQuery = userAddress && username ? { $or: [userAddress, username] } : {};

	let returnUser: ListResponseAPI<User> = await queryItemsOfModelInPageService(
		userModel,
		objQuery,
		pageId,
		pageSize,
		getSortObj(sort),
		"userAddress",
	);

	return returnUser;
};

const updateUserService = async (
	userAddress: string,
	avatar: string,
	background: string,
	username: string,
	email: string,
	social: string,
	bio: string,
): Promise<User> => {
	const user: User = await updateOneService(
		userModel,
		{
			userAddress,
		},
		{
			avatar,
			background,
			username,
			email,
			bio,
			social,
		},
		{
			new: true,
		},
	);

	return user;
};

const getAllUsersService = async () => {
	const usersInBlackList = await userModel.find().populate("userInBlackList").lean();
	return usersInBlackList;
};

const getSearchUserByIdService = async (userId: string): Promise<User> => {
	const user: User = await findOneService(userModel, { _id: createObjIdService(userId) });
	return user;
};

const verifySignUserService = (userAddress: string, publicKey: string, nonce: number, signature: string): Boolean => {
	const fullMessage = `APTOS\naddress: ${userAddress}\napplication: ${process.env.DOMAIN}\nnonce: ${nonce}\nmessage: Login Marketplace`;

	return nacl.sign.detached.verify(
		Buffer.from(fullMessage),
		Buffer.from(signature.slice(2), "hex"),
		Buffer.from(publicKey.slice(2), "hex"),
	);
};

export {
	createUserIfNotExistService,
	checkUserExistsService,
	updateUserService,
	getOneUserService,
	getManyUserService,
	getAllUsersService,
	getSearchUserByIdService,
	verifySignUserService,
};

import userModel from "../models/user.model";
import nacl from "tweetnacl";
import sha256 from "sha256";
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
import { getManyHistoryService } from "./history.services";
import blacklistModel from "../models/blacklist.model";
import { getSortObj } from "./other.services";
import { BlackUser, User } from "../interfaces/user.interfaces";
import { ListResponseAPI } from "../interfaces/responseData.interfaces";
import { checkChainIdCollectionService } from "./collection.services";

const createUserIfNotExistService = async (userAddress: string, nonce: string): Promise<User> => {
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

const verifySignUserService = (publicKey: string, nonce: string, signature: string): Boolean => {
	const fullMessage = `APTOS\nnonce: ${nonce}\nmessage: ${sha256(publicKey)}`;
	const fullMessage1 = `APTOS\nmessage: ${sha256(publicKey)}\nnonce: ${nonce}`;
	//console.log("fullMessage: ", fullMessage);

	return (
		nacl.sign.detached.verify(Buffer.from(fullMessage), Buffer.from(signature, "hex"), Buffer.from(publicKey, "hex")) ||
		nacl.sign.detached.verify(Buffer.from(fullMessage1), Buffer.from(signature, "hex"), Buffer.from(publicKey, "hex"))
	);
};

export const topTraderService = async (request: Number, chainID: Number) => {
	let trd = new Array<Object>();
	let data: { address: User, volumeTrade: Number }[] = [];
	const user = await getAllUsersService();
	await Promise.all(
		user.map(async (user, index) => {
			const date = new Date(new Date().setDate(new Date().getDate() - Number(request)));
			const trade = await getManyHistoryService({ from: user.userAddress, createdAt: { $gte: date } });
			let sum = 0;
			await Promise.all(
				trade.map(async trader => {
					const check = await checkChainIdCollectionService(String(trader.collectionId), chainID);
					if (check === true) {
						sum = sum + Number(trader.price);
					}
				}),
			);
			const tradeOne: any = {
				address: user,
				volumeTrade: sum,
			};
			data.push(tradeOne);
		}),
	);
	data.sort((a: any, b: any) => parseFloat(b.volumeTrade.toString()) - parseFloat(a.volumeTrade.toString()));
	console.log(data);
	data.map((data, index) => {
		// if(index<10){
		trd.push(data);
		// }
	});
	return trd;
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

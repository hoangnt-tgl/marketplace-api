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
import { getManyHistoryService, getHistoryTraderByDayService } from "./history.services";
import blacklistModel from "../models/blacklist.model";
import { getSortObj } from "./other.services";
import { BlackUser, User } from "../interfaces/user.interfaces";
import { ListResponseAPI } from "../interfaces/responseData.interfaces";
import { checkChainIdCollectionService } from "./collection.services";
import { checkChainIdItemService } from "./item.services";
import { HistoryTrade } from "../interfaces/history.interfaces";

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

const getTraderByDayService = async (
	address: String,
	fromDate: number,
	toDate: number,
	chainId: number,
): Promise<number> => {
	const histories = await getHistoryTraderByDayService(fromDate, toDate, {
		from: address,
	});
	let result: number = 0;
	await Promise.all(
		histories.map(async (history: HistoryTrade) => {
			const check = await checkChainIdCollectionService(history.collectionId.toString(), Number(chainId));
			if (check === true) {
				result = result + history.usdPrice;
			}
		}),
	);
	return result;
};

export const topTraderService = async (request: number, chainID: number) => {
	let trd = new Array<Object>();
	let data: { user: User, volumeTrade: Number, percent: Number }[] = [];
	const user = await getAllUsersService();

	const getTradeByDay = async (address: String, chainId: number) => {
		const now = Date.now();
		const curDay = now - 24 * 3600 * 1000;
		const lastDay = curDay - 24 * 3600 * 1000;

		const newVolume = await getTraderByDayService(address, curDay, now, chainId);
		const oldVolume = await getTraderByDayService(address, lastDay, curDay, chainId);

		const percent = oldVolume > 0 ? ((newVolume - oldVolume) / oldVolume) * 100 : 0;
		return percent;
	};

	const getTradeByWeek = async (address: String, chainId: number) => {
		const now = Date.now();
		const curWeek = now - 7 * 24 * 3600 * 1000;
		const lastWeek = curWeek - 7 * 24 * 3600 * 1000;
		const newVolume = await getTraderByDayService(address, curWeek, now, chainId);
		const oldVolume = await getTraderByDayService(address, lastWeek, curWeek, chainId);

		const percent = oldVolume > 0 ? ((newVolume - oldVolume) / oldVolume) * 100 : 0;
		return percent;
	};

	const getTradeByMonth = async (address: String, chainId: number) => {
		const now = Date.now();
		const curMonth = now - 30 * 24 * 3600 * 1000;
		const lastMonth = curMonth - 30 * 24 * 3600 * 1000;

		const newVolume = await getTraderByDayService(address, curMonth, now, chainId);
		const oldVolume = await getTraderByDayService(address, lastMonth, curMonth, chainId);

		const percent = oldVolume > 0 ? ((newVolume - oldVolume) / oldVolume) * 100 : 0;
		return percent;
	};
	console.log(request);
	await Promise.all(
		user.map(async (user, index) => {
			const date = new Date(new Date().setDate(new Date().getDate() - Number(request)));
			let from = user.userAddress.toString();
			const trade = await getManyHistoryService({ from, createdAt: { $gte: date } });
			let sum = 0;
			await Promise.all(
				trade.map(async trader => {
					const check = await checkChainIdCollectionService(String(trader.collectionId), chainID);
					if (check === true) {
						sum = sum + Number(trader.price);
					}
				}),
			);
			let percentTrade = 0;
			switch (request) {
				case 7:
					percentTrade = await getTradeByWeek(user.userAddress, chainID);
					break;
				case 30:
					percentTrade = await getTradeByMonth(user.userAddress, chainID);
					break;
				default:
					percentTrade = await getTradeByDay(user.userAddress, chainID);
			}
			const tradeOne: any = {
				user,
				volumeTrade: sum,
				percentTrade,
			};
			data.push(tradeOne);
		}),
	);
	data.sort((a: any, b: any) => parseFloat(b.volumeTrade.toString()) - parseFloat(a.volumeTrade.toString()));
	data.map((data, index) => {
		// Volume Trade > 0
		if (data.volumeTrade) {
			trd.push(data);
		}
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


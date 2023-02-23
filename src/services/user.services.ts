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
import fs from "fs";

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
): Promise<any> => {
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
	histories.map(async (history: HistoryTrade) => {
		const check = await checkChainIdCollectionService(history.collectionId.toString(), Number(chainId));
		if (check === true) {
			result = result + history.usdPrice;
		}
	});
	return result;
};

const getTradeByDay = async (request: Number, address: String, chainId: number) => {
	const now = Date.now();
	const curDay = now - Number(request) * 24 * 3600 * 1000;
	const lastDay = curDay - Number(request) * 24 * 3600 * 1000;
	const newVolume = await getTraderByDayService(address, curDay, now, chainId);
	const oldVolume = await getTraderByDayService(address, lastDay, curDay, chainId);
	const percent = oldVolume > 0 ? ((newVolume - oldVolume) / oldVolume) * 100 : 0;
	return percent;
};

export const topTraderService = async (request: number, chainID: number) => {
	let trd = new Array<Object>();
	const user = await getAllUsersService();
	const userTrades = await Promise.all(
		user.map(async user => {
			const date = new Date(new Date().setDate(new Date().getDate() - Number(request)));
			let from = user.userAddress.toString();
			const trade = await getManyHistoryService({ from, createdAt: { $gte: date } });
			let sum = 0;
			trade.forEach(async trader => {
				const check = await checkChainIdCollectionService(String(trader.collectionId), chainID);
				if (check) {
					sum += Number(trader.price);
				}
			});
			let percentTrade = await getTradeByDay(request, user.userAddress, chainID);
			return {
				user,
				volumeTrade: sum,
				percentTrade,
			};
		}),
	);
	userTrades.sort((a, b) => b.volumeTrade - a.volumeTrade);
	trd = userTrades.filter(data => data.volumeTrade);
	return trd;
};


export const topTraderAutoService = async () => {
	let chainID = 2;
	let trd = new Array<Object>();
	const user = await getAllUsersService();
	const userTrades = 
	await Promise.all(
		user.map(async user => {
			//24 Hours
			let from = user.userAddress.toString();
			const date1 = new Date(new Date().setDate(new Date().getDate() - 1));
			const trade1 = await getManyHistoryService({ from, createdAt: { $gte: date1 } });
			let sum1 = 0;
			await Promise.all(
				trade1.map(async trader => {
					const check = await checkChainIdCollectionService(String(trader.collectionId), chainID);
					if (check) {
						sum1 += Number(trader.price);
					}
				}),
			);
			let percentTrade1 = await getTradeByDay(1, user.userAddress, chainID);
			//7 Days
			const date7 = new Date(new Date().setDate(new Date().getDate() - 7));
			const trade7 = await getManyHistoryService({ from, createdAt: { $gte: date7 } });
			let sum7 = 0;
			await Promise.all(
				trade7.map(async trader => {
					const check = await checkChainIdCollectionService(String(trader.collectionId), chainID);
					if (check) {
						sum7 += Number(trader.price);
					}
				})
			);
			let percentTrade7 = await getTradeByDay(7, user.userAddress, chainID);
			//30 Days
			const date30 = new Date(new Date().setDate(new Date().getDate() - 30));
			const trade30 = await getManyHistoryService({ from, createdAt: { $gte: date30 } });
			let sum30 = 0;
			await Promise.all(
				trade30.map(async trader => {
					const check = await checkChainIdCollectionService(String(trader.collectionId), chainID);
					if (check) {
						sum30 += Number(trader.price);
					}
				})
			);
			let percentTrade30 = await getTradeByDay(30, user.userAddress, chainID);
			return {
				user,
				volume24Hour: sum1,
				volume7Days: sum7,
				volume30Days: sum30,
				percent24Hour: percentTrade1,
				percent7Days: percentTrade7,
				percent30Days: percentTrade30,
			};
		}),
	);
	// userTrades.sort((a, b) => b.volumeTrade - a.volumeTrade);
	trd = userTrades.filter(data => data.volume30Days);
	fs.writeFile("./public/topTrader.json", JSON.stringify(trd), "utf8", () => {
		console.log(`Update top trader successfully at ${new Date(Date.now())}`);
	});
};

export const gettopTraderAutoService = async () => {
	const data = fs.readFileSync("./public/topTrader.json", "utf8");
	return JSON.parse(data);
}


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





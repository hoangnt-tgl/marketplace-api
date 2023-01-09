import { createObjIdService, createService, updateOneService } from "./model.services";
import { IGO, INO, ItemIGO, PaymentIGO } from "../interfaces/INO.interfaces";
import igoModel from "../models/igo.model";
import INOModel from "../models/INO.model";
import { ChainId } from "../interfaces/other.interfaces";
import { getSortObj, paginateArrayService, removeUndefinedOfObj } from "./other.services";
import { ListResponseAPI, MongooseObjectId } from "../interfaces/responseData.interfaces";
import { changePriceService, fromWeiToTokenService, getManyTokenService } from "./price.services";
import { Types } from "mongoose";

const createIGOService = async (
	ino: INO,
	listItem: { itemId: Types.ObjectId, quantity: number }[],
	startTime: number,
	endTime: number,
	nativeTokenName: string,
	limitItemPerUser: number,
	nativeTokenPrice: string,
	protocolTokenName: string,
	protocolTokenPrice: string,
	stableTokenName: string,
	stableTokenPrice: string,
) => {
	const igoPayment = [nativeTokenName, protocolTokenName, stableTokenName];
	const igoPrice = [nativeTokenPrice, protocolTokenPrice, stableTokenPrice];
	const tokens = await getManyTokenService({
		chainId: ino.chainId,
		tokenSymbol: [nativeTokenName, protocolTokenName, stableTokenName],
	});
	let floorPrice = 0;
	for (let i = 0; i < igoPayment.length; i++) {
		const token = tokens.find(t => t.tokenAddress === igoPayment[i]);
		if (token) {
			const price = await changePriceService(token.tokenSymbol, "usd", igoPrice[i]);
			floorPrice = floorPrice > price ? price : floorPrice;
		}
	}

	const igo = await createService(igoModel, {
		inoId: ino._id,
		chainId: ino.chainId,
		collectionId: ino.collectionId,
		listItem,
		limitItemPerUser: limitItemPerUser,
		listPayment: igoPayment,
		startTime: startTime,
		endTime: endTime,
	});
	return igo;
};

const getOneIGOService = async (queryObj: any) => {
	const igo = await igoModel.findOne(queryObj).populate({ path: "infoINO" });
	return igo;
};

const queryIGOService = async (
	textSearch: string = "",
	chainId: ChainId[],
	userAddress: string,
	status: string,
	sort: string[],
	pageId: number,
	pageSize: number,
) => {
	const queryStatus =
		status === "live"
			? { startTime: { $lte: Math.floor(Date.now() / 1000), endTime: { $gt: Math.floor(Date.now() / 1000) } } }
			: status === "upcoming"
			? { startTime: { $gt: Math.floor(Date.now() / 1000) } }
			: status === "completed"
			? { endTime: { $lte: Math.floor(Date.now() / 1000) } }
			: {};

	const queryObj = removeUndefinedOfObj({
		...queryStatus,
		chainId: chainId && chainId.length > 0 ? chainId : undefined,
		participant: userAddress ? userAddress : undefined,
	});

	const inoObj = removeUndefinedOfObj({
		path: "infoINO",
		match: textSearch ? { nameINO: { $regex: textSearch, $options: "i" }, typeINO: 2 } : undefined,
	});

	const listIGO: any[] = await igoModel.find(queryObj, "_id refINO").sort(getSortObj(sort)).populate(inoObj).lean();

	const data: MongooseObjectId[] = listIGO.reduce((arr: MongooseObjectId[], cur: IGO) => {
		if (cur.infoINO !== null) {
			arr.push({
				_id: cur._id.toString(),
			});
		}
		return arr;
	}, []);

	const response: ListResponseAPI<MongooseObjectId> = paginateArrayService(data, pageSize, pageId);

	return response;
};

const getIGOByIdService = async (igoId: string) => {
	const igo = await getOneIGOService({ _id: createObjIdService(igoId) });
	return igo;
};

export { createIGOService, getIGOByIdService, queryIGOService };

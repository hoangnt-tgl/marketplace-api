import { Types } from "mongoose";
import { MetaSpacecyAuction } from "../constant/contract.constant";
import { INO } from "../interfaces/INO.interfaces";
import { ChainId } from "../interfaces/other.interfaces";
import inoModel from "../models/INO.model";
import {
	createObjIdService,
	createService,
	findManyService,
	findOneService,
	queryItemsOfModelInPageService,
	updateOneService,
} from "./model.services";
import { removeUndefinedOfObj } from "./other.services";
import tokenModel from "../models/token.model";
import { multiProcessService } from "./other.services";
import { fromWeiToTokenService } from "./price.services";
import { getBalanceOfItem1155 } from "./contract.services";
import INOModel from "../models/INO.model";

const createINOService = async (
	chainId: ChainId,
	collectionId: string,
	listItemId: string[],
	addressINO: string,
	ownerINO: string,
	nameINO: string,
	descriptionINO: string,
	typeINO: number,
	floorPoint: number,
	thumbnails: String[] = [],
): Promise<INO> => {
	const listItem: Types.ObjectId[] = [];
	listItemId.map((id: string) => {
		listItem.push(createObjIdService(id));
	});
	addressINO = typeINO === 1 ? MetaSpacecyAuction[chainId] : addressINO;
	const newINO: INO = await createService(inoModel, {
		chainId,
		collectionId: createObjIdService(collectionId),
		listItemId: listItem,
		addressINO,
		floorPoint,
		nameINO,
		ownerINO,
		descriptionINO,
		typeINO,
		thumbnails,
	});
	return newINO;
};

const getOneINOService = async (objQuery: any): Promise<any> => {
	const ino: INO = await inoModel
		.findOne(objQuery)
		.lean()
		.populate({ path: "items", select: "itemName itemMedia itemTokenId", match: { status: 0, isINO: 1 } })
		.populate({ path: "collectionInfo", select: "collectionAddress collectionName logo" });
	return ino;
};

const getDetailINOService = async (objQuery: any) => {
	try {
		const ino = await inoModel
			.findOne(objQuery)
			.lean()
			.populate({
				path: "requestINO",
				select:
					"network typeINO projectDescription nativeTokenPaymentPrice networkPaymentName networkPaymentPrice stableCoinPaymentPrice companyName projectName projectWebsite email walletAddress startTime endTime",
			})
			.populate({ path: "items", select: "chainId itemTokenId", match: { status: 0, isINO: 1 } })
			.populate({ path: "collectionInfo", select: "_id collectionStandard collectionAddress" });

		const getPaymentAddressToken = async () => {
			const networkToken = await findOneService(tokenModel, {
				chainId: ino.chainId,
				tokenSymbol: ino.requestINO.networkPaymentName.toLowerCase(),
			});
			const stableCoin = await findOneService(tokenModel, { chainId: ino.chainId, tokenSymbol: "usdt" });
			const nativeToken = await findOneService(tokenModel, { chainId: ino.chainId, tokenSymbol: "usdc" });

			const networkPaymentUSD = fromWeiToTokenService(ino.requestINO.networkPaymentPrice, networkToken.decimal);
			const stableCoinUSD = fromWeiToTokenService(ino.requestINO.stableCoinPaymentPrice, stableCoin.decimal);
			const nativePaymentUSD = fromWeiToTokenService(ino.requestINO.nativeTokenPaymentPrice, nativeToken.decimal);
			return {
				data: {
					networkPaymentAddress: networkToken.tokenAddress,
					stableCoinAddress: stableCoin.tokenAddress,
					nativeTokenAddress: nativeToken.tokenAddress,
					networkPaymentTokenUSD: networkPaymentUSD,
					stableCoinPaymentUSD: stableCoinUSD,
					nativePaymentTokenUSD: nativePaymentUSD,
				},
			};
		};

		for (let i = 0; i < ino.items.length; i++) {
			if (ino.items[i].itemStandard === "ERC1155") {
				ino.items[i]["quantity"] = await getBalanceOfItem1155(
					ino.ownerINO,
					ino.collectionInfo.collectionAddress,
					ino.items[i],
				);
			} else ino.items[i]["quantity"] = 1;
		}

		const obj: any = await multiProcessService([getPaymentAddressToken()]);
		return {
			...ino,
			networkPaymentAddress: obj.data.networkPaymentAddress,
			stableCoinAddress: obj.data.stableCoinAddress,
			nativeTokenAddress: obj.data.nativeTokenAddress,
			networkPaymentTokenUSD: obj.data.networkPaymentTokenUSD,
			stableCoinPaymentUSD: obj.data.stableCoinPaymentUSD,
			nativePaymentTokenUSD: obj.data.nativePaymentTokenUSD,
			floorPoint: 1,
			limitItemsPerUser: 10,
		};
	} catch (error) {
		console.log(error);
	}
};

const checkINOIsCompleteService = async (inoId: string) => {
	const ino: INO = await inoModel.findOne({ _id: createObjIdService(inoId) });
	return ino.isComplete;
};

const checkINOExistService = async (inoId: string) => {
	const ino: INO = await findOneService(inoModel, { _id: createObjIdService(inoId) }, "_id");
	return ino ? true : false;
};

const getListINOByOwnerService = async (userAddress: string, typeINO: number) => {
	userAddress = userAddress.toLowerCase();
	const listINO: INO[] = await findManyService(
		inoModel,
		{ ownerINO: userAddress, typeINO, isComplete: false },
		"nameINO",
	);
	return listINO;
};

const updateINOService = async (
	inoId: string,
	nameINO: string = "",
	descriptionINO: string = "",
	thumbnails: [] = [],
	floorPoint: number = 0,
) => {
	const update = removeUndefinedOfObj({
		nameINO,
		descriptionINO,
		thumbnails,
		floorPoint,
	});
	const ino: INO = await updateOneService(inoModel, { _id: createObjIdService(inoId) }, update);
	return ino;
};

const updateINOCompleteService = async (inoId: Types.ObjectId) => {
	const ino: INO = await getOneINOService({ _id: inoId });
	if (ino.listItemId && ino.listItemId.length > 0) {
		await INOModel.updateOne({ _id: inoId }, { isComplete: true });
	}
};

const queryINOService = async (
	pageSize: number,
	page: number,
	chainId: number,
	ownerAddress: string,
	nameINO: string,
	typeINO: number,
) => {
	const objQuery = removeUndefinedOfObj({
		chainId: chainId ? chainId : undefined,
		ownerAddress: ownerAddress ? { $regex: ownerAddress, $options: "i" } : undefined,
		nameINO: nameINO ? { $regex: nameINO, $options: "i" } : undefined,
		typeINO: typeINO ? typeINO : undefined,
		isDelete: false,
	});
	const requests = await queryItemsOfModelInPageService(inoModel, objQuery, page, pageSize);
	return requests;
};

export {
	checkINOIsCompleteService,
	createINOService,
	getOneINOService,
	updateINOService,
	updateINOCompleteService,
	getListINOByOwnerService,
	checkINOExistService,
	queryINOService,
	getDetailINOService,
};

import { property } from "./../interfaces/item.interfaces";
import requestINOModel from "../models/requestINO.model";
import { ChainId } from "../interfaces/other.interfaces";
import {
	createObjIdService,
	createService,
	queryExistService,
	queryItemsOfModelInPageService,
	updateObjService,
} from "./model.services";
import { removeUndefinedOfObj } from "./other.services";
import INOModel from "../models/INO.model";

const createRequestINOService = async (
	projectName: string,
	companyName: string,
	email: string,
	network: ChainId,
	walletAddress: string,
	collectionAddress: any,
	collectionId: any,
	listItemId: any,
	typeINO: number,
	projectDescription: string,
	projectWebsite: string,
	startTime: any,
	endTime: any,
	nativeTokenName: any,
	nativeTokenPrice: any,
	protocolTokenName: any,
	protocolTokenPrice: any,
	stableTokenName: any,
	stableTokenPrice: any,
) => {
	const request = await createService(
		requestINOModel,
		removeUndefinedOfObj({
			projectName,
			companyName,
			email,
			network,
			walletAddress,
			collectionAddress,
			collectionId: collectionId ? createObjIdService(collectionId) : undefined,
			listItemId,
			typeINO,
			projectDescription,
			projectWebsite,
			startTime,
			endTime,
			nativeTokenName,
			nativeTokenPrice,
			protocolTokenName,
			protocolTokenPrice,
			stableTokenName,
			stableTokenPrice,
		}),
	);
	return request;
};

const checkRequestExistService = async (requestId: string) => {
	const result = await queryExistService(requestINOModel, { _id: createObjIdService(requestId) });
	return result;
};

const getListRequestService = async (
	chainId: number[],
	textSearch: string,
	typeINO: number,
	isPin: boolean = false,
	isApprove: boolean = false,
	pageId: number,
	pageSize: number,
) => {
	const objQuery = removeUndefinedOfObj({
		network: chainId && chainId.length > 0 ? chainId : undefined,
		projectName: textSearch ? { $regex: textSearch, $options: "i" } : undefined,
		companyName: textSearch ? { $regex: textSearch, $options: "i" } : undefined,
		collectionAddress: textSearch ? { $regex: textSearch, $options: "i" } : undefined,
		isPin,
		isApprove,
		typeINO: typeINO ? typeINO : undefined,
		isDelete: false,
	});
	const requests = await queryItemsOfModelInPageService(requestINOModel, objQuery, pageId, pageSize);
	return requests;
};

const getRequestDetailService = async (requestId: string) => {
	const request = await requestINOModel.findOne({ _id: createObjIdService(requestId) });
	await requestINOModel.updateOne(
		{ _id: createObjIdService(requestId) },
		{ isRead: true, deleteTime: Date.now() + 2592000000 },
	);
	return request;
};

const deleteRequestService = async () => {
	try {
		await requestINOModel.deleteMany({ isRead: true, deleteTime: { $gte: Date.now() } });
	} catch (error: any) {
		console.log(error.message);
	}
};

const pinRequestService = async (requestId: string, isPin: boolean) => {
	const request = await requestINOModel.updateOne({ _id: createObjIdService(requestId) }, { isPin });
	return request;
};

const approveRequestService = async (requestId: string, isApprove: boolean) => {
	const request = await requestINOModel.updateOne({ _id: createObjIdService(requestId) }, { isApprove });
	return request;
};

const updateINOInfoService = async (inoId: string, properties: property[]) => {
	for (let i = 0; i < properties.length; i++) {
		await updateObjService(INOModel, { _id: inoId }, "properties", properties[i].property, properties[i].value);
	}
};

export {
	createRequestINOService,
	getListRequestService,
	getRequestDetailService,
	pinRequestService,
	deleteRequestService,
	approveRequestService,
	checkRequestExistService,
	updateINOInfoService,
};

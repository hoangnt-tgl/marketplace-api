import advertiseNFTModel from "../models/advertiseNFT.model";
import advertiseCollectionModel from "../models/advertiseCollection.model";
import collectionModel from "../models/collection.model";
import { checkAdvertiseCollectionExistService, checkAdvertiseNFTExistService } from "./advertise.service";
import { createObjIdService, createService, updateOneService } from "./model.services";
import { multiProcessService, postDataToURL } from "./other.services";
import {
	getCollectionAssetERC1155Service,
	getCollectionBoxERC1155Service,
	getCollectionCardService,
	getBoarcDropCollectionService
} from "./collection.services";
import { getBox1155, getItem1155, getManyItemService } from "./item.services";
import { ChainId } from "../interfaces/other.interfaces";
import itemModel from "../models/item.model";

const setConfirmCollectionService = async (collectionId: string, isConfirm: boolean) => {
	const collection = await updateOneService(collectionModel, { _id: createObjIdService(collectionId) }, { isConfirm });
	return collection;
};

const setAdvertiseCollectionService = async (
	collectionId: string,
	mainImage: any,
	secondaryImage: any,
	title: any,
	expireAt: any,
) => {
	const check = await checkAdvertiseCollectionExistService(collectionId);
	let collection;
	if (expireAt) {
		expireAt = new Date(Number(expireAt));
	}
	if (check) {
		collection = await updateOneService(
			advertiseCollectionModel,
			{ collectionId: createObjIdService(collectionId) },
			{ mainImage, secondaryImage, title, expireAt },
		);
	} else {
		collection = await createService(advertiseCollectionModel, {
			collectionId: createObjIdService(collectionId),
			mainImage,
			secondaryImage,
			expireAt,
		});
	}
	return collection;
};

const setAdvertiseNFTService = async (itemId: string, expireAt: any) => {
	const check = await checkAdvertiseNFTExistService(itemId);
	let nft;
	if (expireAt) {
		expireAt = new Date(Number(expireAt));
	}
	if (check) {
		nft = await updateOneService(advertiseNFTModel, { itemId: createObjIdService(itemId) }, { expireAt });
	} else {
		nft = await createService(advertiseNFTModel, {
			itemId: createObjIdService(itemId),
			expireAt,
		});
	}
	return nft;
};

const initBoxService = async (chainId: ChainId) => {
	try {
		await multiProcessService([
			getCollectionBoxERC1155Service(chainId),
			getCollectionAssetERC1155Service(chainId),
			getCollectionCardService(chainId),
		]);
		await getBox1155(chainId);
		await getItem1155(chainId);
		console.log("done");
	} catch (error) {
		console.log(error);
	}
};

const initCollectionService = async (chainId: ChainId) => {
	try {
		await multiProcessService([
			getBoarcDropCollectionService(chainId)
		]);
		console.log("done");
	} catch (error) {
		console.log(error);
	}
};

const getAssetINOService = async (
	chainId: ChainId,
	userAddress: string,
	collectionAddress: string,
	listTokenId: string[],
) => {
	const alchemyURI = process.env.ALCHEMY_API_SERVER || "";
	await postDataToURL(`${alchemyURI}/alchemy/importNFT`, {
		chainId,
		userAddress,
		collectionAddress,
		listTokenId,
	});
	const collection = await collectionModel.findOneAndUpdate(
		{
			chainId,
			collectionAddress: collectionAddress.toLowerCase(),
		},
		{ isConfirm: true, isINO: 1 },
		{ new: true },
	);
	await itemModel.updateMany(
		{ owner: userAddress.toLowerCase(), itemTokenId: listTokenId, collectionId: collection._id },
		{ isINO: 1 },
	);
	const listItem = await getManyItemService({
		owner: userAddress.toLowerCase(),
		itemTokenId: listTokenId,
		collectionId: collection._id,
	});
	return { listItem, collection };
};

export {
	setConfirmCollectionService,
	setAdvertiseCollectionService,
	setAdvertiseNFTService,
	initBoxService,
	initCollectionService,
	getAssetINOService,
};

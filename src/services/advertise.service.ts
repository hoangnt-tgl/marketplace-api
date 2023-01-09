import advertiseNFTModel from "../models/advertiseNFT.model";
import advertiseCollectionModel from "../models/advertiseCollection.model";
import { createObjIdService, findOneService } from "./model.services";

const getAdvertiseCollectionService = async () => {
	const now = new Date(Date.now());
	const allAdvertise = await advertiseCollectionModel.find({ expireAt: { $gt: now } });
	return allAdvertise;
};

const getAdvertiseNFTService = async () => {
	const now = new Date(Date.now());
	const allAdvertise = await advertiseNFTModel.find({ expireAt: { $gt: now } }).populate({path: "itemId", select: "itemMedia itemPreviewMedia"});
	return allAdvertise;
};

const checkAdvertiseCollectionExistService = async (collectionId: string) => {
	const advertise = await findOneService(advertiseCollectionModel, { collectionId: createObjIdService(collectionId) });
	return advertise ? true : false;
};

const checkAdvertiseNFTExistService = async (itemId: string) => {
	const advertise = await findOneService(advertiseNFTModel, { itemId: createObjIdService(itemId) });
	return advertise ? true : false;
};

export {
	getAdvertiseCollectionService,
	checkAdvertiseCollectionExistService,
	checkAdvertiseNFTExistService,
	getAdvertiseNFTService,
};

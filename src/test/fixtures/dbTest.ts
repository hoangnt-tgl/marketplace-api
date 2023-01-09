import mongoose from "mongoose";
import userModel from "../../models/user.model";
import collectionModel from "../../models/user.model";
import itemModel from "../../models/user.model";
import orderModel from "../../models/user.model";
import {
	DEFAULT_PICTURE,
	DEFAULT_STANDARD,
	DEFAULT_ITEM_STATUS,
	DEFAULT_ITEM_CATEGORY,
} from "../../constant/default.constant";

const firstUser = {
	userAddress: "0x236A2B176FAC613b1c1091cA2EcA2915b07e9492",
};

const firstCollection = {
	_id: new mongoose.Types.ObjectId(),
	userAddress: "0x236A2B176FAC613b1c1091cA2EcA2915b07e9492",
	logo: DEFAULT_PICTURE,
	background: DEFAULT_PICTURE,
	collectionName: "Collection 1",
	chainId: 4,
	collectionStandard: DEFAULT_STANDARD,
	description: "Test First Collection",
};

const firstItem = {
	_id: new mongoose.Types.ObjectId(),
	itemName: "Item 1",
	itemMedia: DEFAULT_PICTURE,
	owner: "0x236A2B176FAC613b1c1091cA2EcA2915b07e9492",
	creator: "0x236A2B176FAC613b1c1091cA2EcA2915b07e9492",
	status: DEFAULT_ITEM_STATUS,
	category: DEFAULT_ITEM_CATEGORY,
	collectionId: firstCollection._id,
	collectionAddress: 4,
	itemStandard: DEFAULT_STANDARD,
	chainId: 4,
};

const firstOrder = {
	maker: "333",
	taker: "222",
	makerRelayerFee: 123,
	takerRelayerFee: 100,
	side: 99,
	saleKind: 3,
	target: "gamek.com",
	howToCall: 2,
	callData: "uuu",
	replacementPattern: "@@",
	staticTarget: "test.com",
	extraData: "no",
	basePrice: 111,
	extra: 1,
	listingTime: 1,
	expirationTime: 3,
	salt: "111",
	orderBaseId: "82834234adas",
	signatureId: "sdsdf923adfs",
	itemId: "dffdsfdsfds",
	paymentToken: "ETH",
};

export const setupDBTest = async () => {
	// await userModel.deleteMany({})
	// await orderModel.deleteMany({})
	// await collectionModel.deleteMany({})
	// await itemModel.deleteMany({})

	// await new userModel(firstUser).save();
	await new collectionModel(firstCollection).save();
	// await new orderModel(firstOrder).save();
	// await new itemModel(firstItem).save();
};

import { Types } from "mongoose";
import { ChainId } from "./other.interfaces";
import { MongooseObjectId } from "./responseData.interfaces";
import { User } from "./user.interfaces";
import { Collection } from "./collection.interfaces";
export interface property {
	property: string;
	value: string;
}

export interface Item {
	_id: Types.ObjectId;
	chainId: ChainId;
	itemTokenId: string;
	itemName: string;
	description: string;
	itemMedia: string;
	itemOriginMedia: string;
	itemPreviewMedia: string;
	properties: object;
	owner: Array<string>;
	creator: string;
	status: number;
	offer_status: number;
	price: string;
	priceType: string;
	collectionId: Types.ObjectId;
	itemStandard: string;
	isFreeze: boolean;
	external_url: string;
	ownerInfo: User[];
	creatorInfo: User;
	isBox: boolean;
	collectionInfo: Collection;
}

export interface LessItemInfo extends Item {
	interaction: boolean;
	currentPrice: number;
	priceLogo: string;
	usdPrice: number;
	isLike: boolean;
}

export interface ExtraItemInfo extends LessItemInfo {
	order: MongooseObjectId[];
}

export interface ItemInteraction {
	userAddress: string;
	itemId: Types.ObjectId;
	state: boolean;
}

export interface QueryItem {
	itemName: string;
	owner: string[];
	creator: string;
	collectionId: string[];
	itemStandard: string;
	status: string[];
	paymentToken: string;
	tokenSymbol: string;
	minPrice: number;
	maxPrice: number;
	sort: string[];
	chainId: number[];
	offer_status: number;
}

//custom interface Item
export interface Item1{
	_id: Types.ObjectId;
	chainId: ChainId;
	itemTokenId: string;
	itemName: string;
	description: string;
	itemMedia: string;
	itemOriginMedia: string;
	itemPreviewMedia: string;
	properties: object;
	owner: Array<string>;
	creator: string;
	status: number;
	offer_status: number;
	price: string;
	priceType: string;
	collectionId: Types.ObjectId;
	itemStandard: string;
	isFreeze: boolean;
	isINO: boolean;
	external_url: string;
}

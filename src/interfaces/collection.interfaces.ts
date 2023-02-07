import { Types } from "mongoose";
import { Item } from "./item.interfaces";
import { ChainId, Query } from "./other.interfaces";
import { User } from "./user.interfaces";
export interface Collection {
	_id: Types.ObjectId;
	collectionAddress: string;
	userAddress: string;
	logo: string;
	background: string;
	collectionName: string;
	collectionStandard: string;
	royalties: number;
	description: string;
	volumeTrade: number;
	chainId: string;
	category: number;
	isConfirm: boolean;
	ownerInfo: User;
	isINO: Number;
	listItem?: Item[];
}
export interface LessInfoCollection extends Collection {
	listItem: Item[];
	items: number;
	username: string;
}
export interface ExtraInfoCollection extends LessInfoCollection {
	items: number;
	owners: number;
	floorPrice: number;
	volume24Hour: number;
	volume7Days: number;
	volume30Days: number;
	percent24Hour: number;
	percent7Days: number;
	percent30Days: number;
	username: string;
}

export interface TopCollection {
	[key: string]: ExtraInfoCollection;
}

export interface QueryCollection extends Query {
	chainId: string[];
	userAddress: string;
	collectionName: string;
	collectionStandard: string;
	category: number[];
}

// export interface isINO extends Collection{
// 	isINO: Number;
// }
export interface Collection1 {
	_id: Types.ObjectId;
	collectionAddress: string;
	userAddress: string;
	logo: string;
	background: string;
	collectionName: string;
	collectionStandard: string;
	royalties: number;
	description: string;
	volumeTrade: number;
	chainId: string;
	category: number;
	isConfirm: boolean;
	ownerInfo: User;
	collectionId: String;
	image: String;
	tittle: String;
	totalNFT: Number;
	availableNFT: Number;
	price: Number;
	owner: Number;
	totalSales: Number;
	status: Boolean;
	startTime: Number;
	endTime: Number;
	benefits: [];
	creator: String;
	ERC: String;
	item: Object;
	content: Object;
	avatar: String;
}

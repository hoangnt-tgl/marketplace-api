"use strict";
// import { Types } from "mongoose";
// import { Collection } from "./collection.interfaces";
// import { Item } from "./item.interfaces";
// import { ChainId } from "./other.interfaces";
// import { User } from "./user.interfaces";
// export interface INO {
// 	_id: Types.ObjectId;
// 	chainId: ChainId;
// 	collectionId: Types.ObjectId,
// 	listItemId: Types.ObjectId[],
// 	addressINO: string;
// 	ownerINO: string;
// 	nameINO: string;
// 	descriptionINO: string;
// 	typeINO: string;
// 	isComplete: boolean;
// 	items: Item[],
// 	collectionInfo: Collection
// 	floorPoint: number
// }
// export interface Auction {
// 	_id: Types.ObjectId;
// 	chainId: ChainId
// 	listItemId: Types.ObjectId[];
// 	collectionId: Types.ObjectId;
// 	paymentToken: string;
// 	minPrice: string;
// 	highestBid: string;
// 	highestBidder: string;
// 	bidIncreasePercent: number;
// 	seller: string;
// 	refINO: Types.ObjectId;
// 	startTime: number;
// 	endTime: number;
// 	isLive: boolean;
// 	infoINO: INO;
// 	isParticipate: boolean;
// 	participant: string[];
// }
// export interface MakeBid {
// 	_id: Types.ObjectId,
// 	auctionId: Types.ObjectId,
// 	userAddress: string,
// 	bidAmount: string,
// 	paymentToken: string,
// 	transactionHash: string,
// 	userInfo: User
// }
// export interface ExtraMakeBid extends MakeBid {
// 	tokenAmount: number,
// 	priceType: string,
// }
// export interface ExtraAuctionInfo extends Auction {
// 	minPriceUsd: number,
// 	highestBidUsd: number,
// 	amountBidder: number,
// 	priceType: string,
// 	status: string,
// }
// export interface ItemIGO extends Item {
// 	quantity: number;
// }
// export interface PaymentIGO {
// 	paymentToken: string,
// 	price: string
// }
// export interface IGO {
// 	_id: Types.ObjectId,
// 	inoId: Types.ObjectId,
// 	chainId: number,
// 	collectionId: string ,
// 	listItem: ItemIGO[],
// 	limitItemPerUser: number,
// 	listPayment: PaymentIGO[],
// 	startTime: number,
// 	endTime: number,
// 	participant: string[],
// 	infoINO: INO,
// 	totalVolume: number,
// 	floorPrice: number,
// 	unitPrice: number,
// }

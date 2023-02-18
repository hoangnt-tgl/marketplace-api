import { Types } from "mongoose";
import { ChainId } from "./other.interfaces";

export interface Order {
	_id: Types.ObjectId;
	chainId: number;
	maker: string;
	itemId: Types.ObjectId;
	minPrice: string;
	coinType: string;
	creationNumber: number;
	amount: number;
	startTime: string;
	expirationTime: string;
	instantSale: boolean;
	auctionId: string;
}

export interface ExtraOrderInfo extends Order {
	salePrice: number;
	tokenSymbol: string;
	usdPrice: number;
}

export interface ExtraOfferInfo extends Order {
	priceLogo: string;
	offerPrice: number;
	usdPrice: number;
	tokenSymbol: string;
}

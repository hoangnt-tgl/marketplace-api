import { Types } from "mongoose";
import { Item } from "./item.interfaces";
import { ChainId } from "./other.interfaces";

export interface Order {
	_id: Types.ObjectId;
	chainId: ChainId;
	maker: string;
	taker: string;
	quantity: number;
	makerRelayerFee: string;
	takerRelayerFee: string;
	feeRecipient: string;
	side: number;
	saleKind: number;
	target: string;
	itemId: Types.ObjectId;
	howToCall: number;
	callData: string;
	replacementPattern: string;
	staticTarget: string;
	staticExtraData: string;
	paymentToken: string;
	basePrice: string;
	extra: string;
	listingTime: number;
	expirationTime: number;
	salt: string;
	feeMethod: number;
	makerProtocolFee: string;
	takerProtocolFee: string;
	r: string;
	s: string;
	v: string;
	type: number;
	isDeleted: boolean;
	itemInfo: Item;
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

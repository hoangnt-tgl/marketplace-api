import { Types } from "mongoose";
import { ChainId } from "./other.interfaces";

export interface Token {
	_id: Types.ObjectId;
	chainId: ChainId;
	tokenAddress: string;
	tokenName: string;
	tokenSymbol: string;
	decimal: number;
	logoURI: string;
	officialSymbol: string;
	coingeckoId: string;
	projectUrl: string;
	tokenType: string;
}

export interface ReturnToken {
	chainId: ChainId;
	name: string;
	address: string;
	symbol: string;
	logoURI: string;
}

export interface ChangePrice {
	_id: Types.ObjectId;
	pair: string;
	priceFeedContract: string;
	result: number;
	decimal: number;
}

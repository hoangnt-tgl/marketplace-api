import { findManyService, findOneService } from "./model.services";
import { formatUnits } from "@ethersproject/units";
import tokenModel from "../models/token.model";
import changePriceModel from "../models/changePrice.model";
import { ChangePrice, Token } from "../interfaces/token.interfaces";
import { DEFAULT_CHAIN_ID } from "../constant/default.constant";

const getTokenService = async (objQuery: any, properties = ""): Promise<Token> => {
	let token: Token = await findOneService(tokenModel, objQuery, properties);
	if (!token) {
		token = await findOneService(tokenModel, { chainId: 1, tokenSymbol: "eth" }, properties);
	}
	return token;
};

const getManyTokenService = async (objQuery: any): Promise<Token[]> => {
	const tokens: Token[] = await findManyService(tokenModel, objQuery);
	return tokens;
};

const getPriceService = async (objQuery: any): Promise<ChangePrice> => {
	const price: ChangePrice = await findOneService(changePriceModel, objQuery);
	return price;
};

const changePriceService = async (from: string, to: string, weiPrice: string): Promise<number> => {
	try {
		from = from.toLowerCase();
		to = to.toUpperCase();
		const chainId: number = DEFAULT_CHAIN_ID || 4;
		const pair: string = `${from.toUpperCase()}-${to}`;
		const token: Token = await getTokenService({ chainId, tokenSymbol: from });
		let priceFeed: ChangePrice = await getPriceService({ pair });
		const tokenPrice: number = fromWeiToTokenService(weiPrice, token.decimal);
		const usdPrice: number = priceFeed.result * tokenPrice;
		// console.log(tokenPrice);
		console.log(`${from} - ${to} - ${weiPrice} - ${usdPrice} - ${token.decimal}`);
		return usdPrice;
	} catch (error) {
		console.log(error)
	}
	return 0;
};

const fromWeiToTokenService = (weiPrice: string, tokenDecimal: number): number => {
	if (tokenDecimal === 1) {
		return Number(weiPrice);
	}
	return weiPrice === "0" ? 0 : Number(formatUnits(weiPrice, tokenDecimal));
};

const createTokenService = async (
	chainId: number,
	tokenName: string,
	tokenSymbol: string,
	tokenAddress: string,
	decimal: number = 18,
	logoURI: string,
	isNative: boolean = false,
) => {
	try {
		let newToken = await new tokenModel({
			chainId: chainId,
			tokenName: tokenName,
			tokenSymbol: tokenSymbol,
			tokenAddress: tokenAddress,
			decimal: decimal,
			logoURI: logoURI,
			isNative: isNative,
		});
		return await newToken.save();
	} catch (err) {
		return err;
	}
};

export {
	getTokenService,
	getPriceService,
	changePriceService,
	fromWeiToTokenService,
	getManyTokenService,
	createTokenService,
};

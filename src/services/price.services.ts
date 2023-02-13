import tokenModel from "../models/token.model";

export const createTokenService = async (
	chainId: number,
	tokenName: string,
	tokenSymbol: string,
	tokenAddress: string,
	decimal: number,
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
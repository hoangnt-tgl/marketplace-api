import tokenModel from "../models/token.model";
import { createService } from "./model.services";

export const createTokenService = async (
	chainId: number,
	tokenName: string,
	tokenSymbol: string,
    officialSymbol: string,
    coingeckoId: string,
	decimal: number,
    logoURI: string,
    projectUrl: string,
    tokenAddress: string,
    tokenType: string
) => {
	try {
		let newToken = new tokenModel({
			chainId: chainId,
			tokenName: tokenName,
			tokenSymbol: tokenSymbol,
			tokenAddress: tokenAddress,
			decimal: decimal,
			logoURI: logoURI,
            officialSymbol: officialSymbol,
            coingeckoId: coingeckoId,
            projectUrl: projectUrl,
            tokenType: tokenType,
		});
		return await newToken.save();
	} catch (err) {
		return err;
	}
};

export const createToken = async (
    chainId: number,
	tokenName: string,
	tokenSymbol: string,
    officialSymbol: string,
    coingeckoId: string,
	decimal: number,
    logoURI: string,
    projectUrl: string,
    tokenAddress: string,
    tokenType: string) => {
        try{
            await createService(tokenModel, {
                chainId,
                tokenName,
                tokenSymbol,
                officialSymbol,
                coingeckoId,
                decimal,
                logoURI,
                projectUrl,
                tokenAddress,
                tokenType
            });
        } catch (err) {
            console.log(err);
        }
};

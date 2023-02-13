import { Request, Response } from "express";
import { createTokenService } from "../services/price.services";

const createTokenController = async (req: Request, res: Response) => {
	try {
        const token: [] = req.body;
        await Promise.all(
            token.map(async(tokens: any) => {
                const chainId = 2;
                const tokenName = tokens.name;
                const tokenAddress = tokens.token_type.account_address;
                const tokenSymbol = tokens.symbol;
                const decimal = tokens.decimals;
                const logoURI = tokens.logo_url;
                const isNative = true;
                await createTokenService(chainId,tokenName, tokenSymbol, tokenAddress, decimal, logoURI, isNative);
            })
        );
		// let { chainId, tokenName, tokenAddress, tokenSymbol, decimal, logoURI, isNative } = req.body;
        // console.log(chainId, " - " ,tokenName, " - " , tokenAddress, " - " , tokenSymbol, " - " , decimal, " - " , logoURI, " - " , isNative);
		// let result = await createTokenService(chainId, tokenName, tokenSymbol, tokenAddress, decimal, logoURI, isNative);
	    return res.status(200).json("Success");
	} catch (error: any) {
		return res.status(500).json(error);
	}
};

export { createTokenController };

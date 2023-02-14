import { Request, Response } from "express";
import { createTokenService, createToken } from "../services/price.services";
import { getAllTokenService} from "../services/token.services";
import { Token } from "../interfaces/token.interfaces";

export const createTokenController = async (req: Request, res: Response) => {
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
                const officialSymbol = tokens.official_symbol;
                const coingeckoId = tokens.coingecko_id;
                const projectUrl = tokens.project_url;
                const tokenType = tokens.token_type.type;
                await createToken(chainId, tokenName, tokenSymbol, officialSymbol, coingeckoId, decimal, logoURI, projectUrl, tokenAddress, tokenType);
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

export const getAllTokenController = async (req: Request, res: Response) => {
    try{
        let result: Token[] = await getAllTokenService();
        return res.status(200).json(result);
    }catch(error: any){
        return res.status(500).json(error); 
    }

}



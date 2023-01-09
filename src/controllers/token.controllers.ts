import { Request, Response } from "express";
import { createTokenService } from "../services/price.services";

const createTokenController = async (req: Request, res: Response) => {
	try {
		let { chainId, tokenName, tokenAddress, tokenSymbol, decimal, logoURI, isNative } = req.body;
		let result = await createTokenService(chainId, tokenName, tokenSymbol, tokenAddress, decimal, logoURI, isNative);
		res.status(200).json(result);
	} catch (error: any) {
		return res.status(500).json(error);
	}
};

export { createTokenController };

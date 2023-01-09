import { Request, Response, NextFunction } from "express";
import { checkUserExistsService } from "../services/user.services";
import { getWeb3ByChainId } from "../services/provider.services";
import { DEFAULT_CHAIN_ID } from "../constant/default.constant";
import { ChainId } from "../interfaces/other.interfaces";
import { ERROR_RESPONSE } from "../constant/response.constants";
import {getNonceUserService} from "../services/user.services";
import {SIGNSTRING} from "../constant/signstring.constants"

const checkUserExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let userAddress =
			req.body.userAddress ||
			req.params.userAddress ||
			req.params.owner ||
			req.params.owner ||
			req.body.owner ||
			req.params.maker ||
			req.body.maker ||
			req.params.taker ||
			req.body.taker ||
			req.params.creator ||
			req.body.creator ||
			req.body.seller ||
			req.params.userAddress ||
			req.query.userAddress;

		if (!userAddress) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		const exist = await checkUserExistsService(userAddress);
		if (!exist) {
			return res.status(404).json({ error: ERROR_RESPONSE[404] });
		}
		return next();
	} catch (error: any) {
		console.log(error)
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
	// return next();
};

//Custom Check User using Cookie
const checkUserExistMiddleware1 = async (req: Request, res: Response, next: NextFunction) => {
try {
	const { userAddress, signature, nonce} = req.body;
	if(signature && nonce){
		const chainId: ChainId = req.body.chainId || req.params.chainId || DEFAULT_CHAIN_ID;
		const web3 = getWeb3ByChainId(chainId);
		const sign = SIGNSTRING + nonce.toString()
		const user1 = web3.eth.accounts.recover(sign, signature.toString());
		if(user1.toLowerCase() === userAddress.toLowerCase())
			return next()
		else return res.status(401).json({ error: ERROR_RESPONSE[401] });
	} else{
		const cookie = req.headers.cookie;
		if (cookie) {
			let cookies: any = cookie
				.split("; ")
				.reduce((ac, cv, i) => Object.assign(ac, { [cv.split("=")[0]]: cv.split("=")[1] }), {});
			if(cookies.signature){
				const user = await getNonceUserService(userAddress);
				const chainId: ChainId = req.body.chainId || req.params.chainId || DEFAULT_CHAIN_ID;
				const web3 = getWeb3ByChainId(chainId);
				const sign = SIGNSTRING + user.nonce.toString()
				const user1 = web3.eth.accounts.recover(sign, cookies.signature.toString());
				if(user1.toLowerCase() === userAddress.toLowerCase())
					return next()
				else return res.status(401).json({ error: ERROR_RESPONSE[401] });
			} else return res.status(401).json({ error: ERROR_RESPONSE[401] });
		}
		else return res.status(401).json({ error: ERROR_RESPONSE[401] });
	}			
} catch (error: any) {
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
}
};

const checkUserMatchOnBlockchain = async (req: Request, res: Response, next: NextFunction) => {
	// try {
	// 	const signedMessage = req.body.secret || "";
	// 	const chainId: ChainId = req.body.chainId || req.params.chainId || DEFAULT_CHAIN_ID;

	// 	let userAddress =
	// 		req.body.userAddress ||
	// 		req.params.userAddress ||
	// 		req.params.owner ||
	// 		req.params.seller ||
	// 		req.body.owner ||
	// 		req.params.maker ||
	// 		req.body.maker ||
	// 		req.params.creator ||
	// 		req.body.creator ||
	// 		req.body.seller;

	// 	const signature = req.body.signature || req.params.signature || req.headers.signature || "";
	// 	const web3 = getWeb3ByChainId(chainId);
	// 	const user = web3.eth.accounts.recover(signedMessage, signature);
	// 	if (user.toLowerCase() === userAddress.toLowerCase()) return next();
	// 	else return res.status(451).json({ error: ERROR_RESPONSE[451] });
	// } catch (error: any) {
	// 	console.log(error);
	// 	return res.status(500).json({ error: ERROR_RESPONSE[500] });
	// }
	return next();
};

const checkAdminAddress = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const signedMessage = req.body.secret || "";
		const chainId: ChainId = req.body.chainId || req.params.chainId || DEFAULT_CHAIN_ID;

		const signature = req.body.signature || req.params.signature;

		if (!signature) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}

		const web3 = getWeb3ByChainId(chainId);

		const user = web3.eth.accounts.recover(signedMessage, signature);

		const ADMIN_ADDRESS = process.env.ADMIN || "";

		if (user.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) return next();
		return res.status(451).json({ error: ERROR_RESPONSE[451] });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const checkSignLikeItemMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const chainId: ChainId = req.params.chainId || req.body.chainId;
		let userAddress =
			req.body.userAddress ||
			req.params.userAddress ||
			req.params.owner ||
			req.params.owner ||
			req.body.owner ||
			req.params.maker ||
			req.body.maker ||
			req.params.creator ||
			req.body.creator ||
			req.body.seller ||
			req.query.userAddress;
		const signature = req.body.signature || req.params.signature;

		if (!signature) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		const web3 = getWeb3ByChainId(chainId);
		const secret = req.body.secret || "";
		const user = web3.eth.accounts.recover(secret, signature);

		if (user.toLowerCase() === userAddress.toLowerCase()) return next();
		else return res.status(401).json({ error: ERROR_RESPONSE[401] });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export { checkUserExistMiddleware, checkUserMatchOnBlockchain, checkSignLikeItemMiddleware, checkAdminAddress };

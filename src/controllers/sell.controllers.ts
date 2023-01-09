import { Request, Response } from "express";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { offerTransactionService, sellTransactionService } from "../services/transaction.services";

// POST Methods
const createSellController = async (req: Request, res: Response): Promise<void> => {
	const {
		chainId,
		feeMethod,
		maker,
		taker,
		quantity,
		makerRelayerFee,
		takerRelayerFee,
		feeRecipient,
		side,
		saleKind,
		target,
		itemId,
		collectionId,
		howToCall,
		callData,
		replacementPattern,
		staticTarget,
		staticExtraData,
		paymentToken,
		basePrice,
		extra,
		listingTime,
		expirationTime,
		salt,
		r,
		s,
		v,
		makerProtocolFee,
		takerProtocolFee,
		type,
	} = req.body;

	try {
		if (type === 0) {
			const orderSell = await sellTransactionService(
				chainId,
				feeMethod,
				maker,
				taker,
				makerRelayerFee,
				takerRelayerFee,
				feeRecipient,
				side,
				saleKind,
				target,
				itemId,
				collectionId,
				howToCall,
				callData,
				replacementPattern,
				staticTarget,
				staticExtraData,
				paymentToken,
				basePrice,
				extra,
				listingTime,
				expirationTime,
				salt,
				r,
				s,
				v,
				makerProtocolFee,
				takerProtocolFee,
				type,
				quantity,
			);

			if (orderSell) res.status(200).send({ message: "Create Order's sell was successful", orderSell });
			else res.status(403).send({ error: ERROR_RESPONSE[403] });
		} else if (type === 1) {
			let newOrderOffer = await offerTransactionService(
				chainId,
				feeMethod,
				maker,
				taker,
				makerRelayerFee,
				takerRelayerFee,
				feeRecipient,
				side,
				saleKind,
				target,
				itemId,
				howToCall,
				callData,
				replacementPattern,
				staticTarget,
				staticExtraData,
				paymentToken,
				basePrice,
				extra,
				listingTime,
				expirationTime,
				salt,
				r,
				s,
				v,
				makerProtocolFee,
				takerProtocolFee,
				type,
				quantity,
			);

			if (newOrderOffer) res.status(200).send({ message: "Offer successful", newOrderOffer });
			else res.status(403).send({ message: ERROR_RESPONSE[403] });
		} else {
			res.status(500).send({ message: ERROR_RESPONSE[500] });
		}
	} catch (err: any) {
		console.log(err.message);
	}
};

export { createSellController };

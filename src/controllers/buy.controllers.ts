import { Request, Response } from "express";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { acceptOfferTransactionService, buyTransactionService } from "../services/transaction.services";

const createBuyController = async (req: Request, res: Response): Promise<void> => {
	const {
		chainId,
		makerProtocolFee,
		takerProtocolFee,
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
		finalPrice,
		extra,
		listingTime,
		expirationTime,
		salt,
		r,
		s,
		v,
		transactionHash,
		type,
		quantity,
		orderAcceptedId,
	} = req.body;

	try {
		if (type === 2) {
			const orderBuy = await buyTransactionService(
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
				finalPrice,
				extra,
				listingTime,
				expirationTime,
				salt,
				r,
				s,
				v,
				transactionHash,
				makerProtocolFee,
				takerProtocolFee,
				quantity,
				orderAcceptedId,
			);
			if (!orderBuy) res.status(200).send({ message: "Create Order's buy was successfully" });
			else res.status(403).send({ error: ERROR_RESPONSE[403] });
		} else if (type === 3) {
			const orderOffer = await acceptOfferTransactionService(
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
				finalPrice,
				extra,
				listingTime,
				expirationTime,
				salt,
				r,
				s,
				v,
				transactionHash,
				makerProtocolFee,
				takerProtocolFee,
				quantity,
				orderAcceptedId,
			);

			if (!orderOffer) res.status(200).send({ message: "Offer successfully accepted" });
			else res.status(403).send({ error: ERROR_RESPONSE[403] });
		} else {
			res.status(403).send({ error: ERROR_RESPONSE[403] });
		}
	} catch (err: any) {
		console.log(err.message);
	}
};

export { createBuyController };

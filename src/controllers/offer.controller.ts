import { Request, Response } from "express";
import { deleteOneService } from "../services/model.services";
import { queryOfferService, getOfferDetailService } from "../services/offer.services";
import orderModel from "../models/Order.model";
import { createOrderService } from "../services/Order.services";
import { ERROR_RESPONSE } from "../constant/response.constants";

const getOfferDetailController = async (req: Request, res: Response) => {
	const { orderId } = req.params;

	try {
		const offer = await getOfferDetailService(orderId);
		if (!offer) return res.status(400).json({ message: "Offer not found" });
		res.status(200).json(offer);
	} catch (error: any) {
		res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getOfferByItemController = async (req: Request, res: Response) => {
	const { orderId } = req.params;

	try {
		const offer = await getOfferDetailService(orderId);
		return res.status(200).json(offer);
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getOfferByUserController = async (req: Request, res: Response) => {
	const { orderId } = req.params;
	try {
		const offer = await getOfferDetailService(orderId);
		return res.status(200).json({ data: offer });
	} catch (error: any) {
		res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const queryOfferController = async (req: Request, res: Response) => {
	const { chainId, maker, taker, itemId, asc } = req.body;
	
	try {
		const offers = await queryOfferService(chainId, maker, taker, itemId, asc);
		return res.status(200).json({ data: offers });
	} catch (error: any) {
		res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

// const queryOneOfferController = async (req: Request, res: Response) => {
// 	const { userAddress, itemId } = req.params;

// 	try {
// 		const offer = await queryOfferService({ maker: userAddress, itemId });
// 		if (offer) res.status(200).json(offer);
// 		else res.status(400).json({ message: "Failed to get offer" });
// 	} catch (error: any) {
// 		res.status(400).json({ errors: error.message });
// 	}
// };

const updateOfferController = async (req: Request, res: Response) => {
	const { orderId } = req.params;
	const {
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
		quantity,
	} = req.body;
	try {
		let newOrderOffer: any;
		Promise.all([
			await deleteOneService(orderModel, { _id: orderId }),
			(newOrderOffer = await createOrderService(
				chainId,
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
				feeMethod,
				makerProtocolFee,
				takerProtocolFee,
				r,
				s,
				v,
				1,
				quantity,
			)),
		]);
		if (newOrderOffer) return res.status(200).send({ message: "Offer successful", newOrderOffer });
		else return res.status(403).send({ message: ERROR_RESPONSE[403] });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};
export {
	updateOfferController,
	getOfferByUserController,
	getOfferDetailController,
	queryOfferController,
	getOfferByItemController,
	// queryOneOfferController,
};

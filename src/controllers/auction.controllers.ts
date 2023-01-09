import { Request, Response } from "express";
import { createHistoryService } from "../services/history.services";
import {
	createAuctionService,
	makeBidService,
	queryAuctionService,
	getTopBidService,
	getAuctionByIdService,
	auctionParticipateService,
	settleAuctionService,
} from "../services/auction.services";
import { MetaSpacecyAuction } from "../constant/contract.constant";
import { createBidService, deleteBidService, getListBidderService } from "../services/makeBid.services";
import { updateOwnerItemService, updateStatusItemService } from "../services/item.services";
import { getWeb3ByChainId } from "../services/provider.services";
import { isHex } from "../services/web3.services";
import { getTokenService } from "../services/price.services";
import { Auction } from "../interfaces/INO.interfaces";
import { ResponseAPI } from "../interfaces/responseData.interfaces";
import { createINOService, updateINOCompleteService, updateINOService } from "../services/INO.service";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { createObjIdService, findOneService } from "../services/model.services";
import auctionModel from "../models/auction.model";
import { multiProcessService } from "../services/other.services";
import itemModel from "../models/item.model";

const createAuctionController = async (req: Request, res: Response) => {
	const {
		userAddress,
		chainId,
		nameINO,
		descriptionINO,
		collectionId,
		listItemId,
		minPrice,
		bidIncreasePercent,
		paymentToken,
		transactionHash,
		endTime,
		startTime,
	} = req.body;
	try {
		const ino = await createINOService(
			chainId,
			collectionId,
			listItemId,
			MetaSpacecyAuction[chainId],
			userAddress,
			nameINO,
			descriptionINO,
			1,
			0,
		);
		const web3 = getWeb3ByChainId(ino.chainId);
		const check = isHex(web3, paymentToken);
		let paymentTokenSymbol: string = paymentToken;

		if (check) {
			const token = await getTokenService({ chainId: ino.chainId, tokenAddress: paymentToken });
			paymentTokenSymbol = token.tokenSymbol;
		}
		const auction: Auction = await createAuctionService(
			chainId,
			ino._id,
			collectionId,
			listItemId,
			minPrice,
			bidIncreasePercent,
			paymentToken,
			userAddress,
			endTime,
			startTime,
		);
		await Promise.all(
			listItemId.map(async (item: any) => {
				await updateStatusItemService(item, { status: 2 });
				await createHistoryService(
					ino.collectionId,
					item,
					ino.ownerINO,
					MetaSpacecyAuction[ino.chainId],
					minPrice,
					paymentTokenSymbol,
					1,
					transactionHash,
					8,
				);
			}),
		);
		const response: ResponseAPI<Auction> = { data: auction };
		return res.status(200).json(response);
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const settleAuctionController = async (req: Request, res: Response) => {
	const { chainId, auctionId, collectionId, paymentToken, transactionHash } = req.body;
	try {
		const web3 = getWeb3ByChainId(chainId);
		const check = isHex(web3, paymentToken);
		let paymentTokenSymbol: string = paymentToken;
		const auction: Auction = await findOneService(auctionModel, { _id: createObjIdService(auctionId) });
		await updateINOCompleteService(auction.refINO);
		if (check) {
			const token = await getTokenService({ chainId: chainId, tokenAddress: paymentToken });
			paymentTokenSymbol = token.tokenSymbol;
		}

		if (auction) {
			await Promise.all(
				auction.listItemId.map(async (itemId: any) => {
					const item = await itemModel.findOne({ _id: createObjIdService(itemId) });
					await multiProcessService([
						updateOwnerItemService(itemId.toString(), auction.highestBidder),
						updateStatusItemService(item, { status: 0, isINO: 0 }),
						createHistoryService(
							collectionId,
							itemId.toString(),
							MetaSpacecyAuction[chainId],
							auction.highestBidder,
							"0",
							paymentTokenSymbol,
							1,
							transactionHash,
							9,
						),
						createHistoryService(
							collectionId,
							itemId.toString(),
							MetaSpacecyAuction[chainId],
							auction.seller,
							auction.highestBid,
							paymentTokenSymbol,
							1,
							transactionHash,
							4,
						),
					]);
				}),
			);
		}
		await deleteBidService(auction._id);
		await settleAuctionService(auction._id);

		const response: ResponseAPI<Auction> = { data: auction };
		return res.status(200).json(response);
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const makeBidController = async (req: Request, res: Response) => {
	const { userAddress, bidAmount, paymentToken, transactionHash } = req.body;
	const auctionId = req.params.auctionId;
	try {
		// await makeBidService(auctionId, bidAmount, userAddress, paymentToken, transactionHash);
		let bid = await createBidService(auctionId, userAddress, bidAmount, paymentToken, transactionHash);
		return res.status(200).json({ data: bid });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getAuctionByIdController = async (req: Request, res: Response) => {
	try {
		const { auctionId } = req.params;
		const { userAddress } = req.query || "";
		const auction = await getAuctionByIdService(auctionId, userAddress);
		return res.status(200).json({ data: auction });
	} catch (error) {
		console.log(error);
	}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getTopBidController = async (req: Request, res: Response) => {
	const { limit } = req.params;
	try {
		const auctions = await getTopBidService(parseInt(limit));
		return res.status(200).json(auctions);
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getListBidderController = async (req: Request, res: Response) => {
	const { auctionId } = req.params;
	try {
		const bidders = await getListBidderService(auctionId);
		return res.status(200).json({ data: bidders });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const queryAuctionController = async (req: Request, res: Response) => {
	const { pageId, pageSize } = req.params;
	const { textSearch, userAddress, chainId, status } = req.body;

	try {
		const auctions = await queryAuctionService(
			textSearch,
			chainId,
			userAddress,
			status,
			Number(pageId),
			Number(pageSize),
		);

		if (auctions) {
			return res.status(200).json(auctions);
		}
	} catch (error: any) {
		console.log(error.message);
	}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const auctionParticipateController = async (req: Request, res: Response) => {
	const { auctionId, userAddress, isJoin, bidAmount, paymentToken, transactionHash } = req.body;
	try {
		const result = await auctionParticipateService(auctionId, userAddress, isJoin, bidAmount);
		const newBid = await makeBidService(userAddress, auctionId, bidAmount, paymentToken, transactionHash);
		if (result) {
			return res.status(200).json({ data: result });
		}
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

export {
	createAuctionController,
	settleAuctionController,
	makeBidController,
	queryAuctionController,
	getAuctionByIdController,
	getTopBidController,
	getListBidderController,
	auctionParticipateController,
};

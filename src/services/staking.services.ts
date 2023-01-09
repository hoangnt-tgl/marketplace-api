import { Item } from "../interfaces/item.interfaces";
import { ChainId } from "../interfaces/other.interfaces";
import { SlotStaking } from "../interfaces/slotStaking.interfaces";
import slotStakingModel from "../models/slotStaking.model";
import { getCollectionAssetERC1155Service } from "./collection.services";
import { getManyItemService } from "./item.services";
import { createObjIdService, queryExistService, queryItemsOfModelInPageService } from "./model.services";
import { removeUndefinedOfObj } from "./other.services";

const checkSlotExistService = async (slotId: string) => {
	return await queryExistService(slotStakingModel, { _id: createObjIdService(slotId) });
};

const getOneSlotStakingService = async (objQuery: any) => {
	const slot: SlotStaking = await slotStakingModel
		.findOne(objQuery)
		.lean()
		.populate({ path: "itemInfo", select: "itemTokenId itemName itemMedia" })
		.populate({ path: "ticketInfo", select: "itemTokenId itemName itemMedia" });
	return slot;
};

const querySlotStakingService = async (
	userAddress: string,
	stateStaking: string,
	option: number,
	itemType: string,
	chainId: number,
	pageId: number,
	pageSize: number,
) => {
	const stateObj =
		stateStaking === "isStaking"
			? {
					isHarvest: false,
					reward: { $gt: 0 },
			  }
			: stateStaking === "isHarvest"
			? {
					isHarvest: true,
			  }
			: stateStaking === "cancel"
			? {
					isHarvest: false,
					reward: 0,
			  }
			: {};

	const queryObj = removeUndefinedOfObj({
		...stateObj,
		chainId: chainId ? chainId : undefined,
		option,
		itemType,
		userAddress,
	});

	const totalItems: number = await slotStakingModel.countDocuments(queryObj);
	const totalPages: number = Math.ceil(totalItems / pageSize);

	const slots: any = await slotStakingModel
		.find(queryObj)
		.sort({ createdAt: -1 })
		.lean()
		.populate({ path: "itemInfo", select: "itemTokenId itemName itemMedia" })
		.populate({ path: "ticketInfo", select: "itemTokenId itemName itemMedia" })
		.skip(pageSize * (pageId - 1))
		.limit(pageSize);

	const amountItems: number = slots.reduce((amount: number, cur: SlotStaking) => {
		amount += cur.itemAmount;
		return amount;
	}, 0);

	return {
		data: slots,
		pagination: {
			totalItems,
			pageSize,
			currentPage: pageId,
			totalPages,
		},
		amountItems,
	};
};

const getTotalStakingInfoService = async (chainId: any) => {
	const slots: SlotStaking[] = await slotStakingModel.find({ chainId }).populate({ path: "itemInfo" }).lean();
	const collectionAsset = await getCollectionAssetERC1155Service(chainId);
	const items = await getManyItemService({ collectionId: collectionAsset._id });

	const totalSlots: { itemName: string, totalNST: number, totalTicketCard: number, totalStake: number }[] = [];
	items.map((item: Item) => {
		totalSlots.push({
			itemName: item.itemName,
			totalNST: 0,
			totalTicketCard: 0,
			totalStake: 0,
		});
	});
	const participants: string[] = [];
	slots.map((slot: SlotStaking) => {
		if (!participants.includes(slot.userAddress)) {
			participants.push(slot.userAddress);
		}
		const index = items.findIndex(item => item.itemName === slot.itemInfo.itemName);
		totalSlots[index].totalNST;
		totalSlots[index].totalNST += slot.reward;
		totalSlots[index].totalTicketCard += slot.ticketCardAmount;
		totalSlots[index].totalStake += 1;
	});

	return {
		totalParticipants: participants.length,
		totalSlots,
	};
};

export { querySlotStakingService, checkSlotExistService, getTotalStakingInfoService };

import { Types } from "mongoose";
import { Item } from "./item.interfaces";
export interface SlotStaking {
	_id: Types.ObjectId;
	itemId: Types.ObjectId
	chainId: number;
	slotIndex: number;
	option: number;
	itemAmount: number;
	startTime: number;
	userAddress: string;
	isHarvest: string;
	reward: number;
	ticketCardId: Types.ObjectId;
	ticketCardAmount: number;
	itemInfo: Item;
	ticketInfo: Item;
}

export interface QuerySlotStaking {
	slots: SlotStaking[];
	amountItems: number;
	totalSlots: number;
}

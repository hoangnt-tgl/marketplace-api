import { Types } from "mongoose";
import { Item } from "./item.interfaces";
import { ChainId } from "./other.interfaces";

export interface History {
    _id: Types.ObjectId;
    collectionId: Types.ObjectId;
    itemId: Types.ObjectId;
    from: string;
    to: string;
    price: string;
    priceType: string
    quantity: number;
    txHash: string;
    type: number;
    createdAt: Date;
    itemInfo: Item;
    fromUserInfo: any;
    collectionInfo: any;
}

export interface minTrade extends History {
    itemID: String;
    minTrade: Number;
}

export interface ExtraHistory extends History {
    chainId: ChainId;
    tokenPrice: number;
}

export interface HistoryTrade extends History {
    chainId: string;
    usdPrice: number
}


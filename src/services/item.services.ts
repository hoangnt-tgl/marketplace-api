import AssetERC1155ABI from "../abis/asset_erc1155.json";
import box1155ABI from "../abis/box1155.json";
import {
	MetaSpacecyCreatureAccessory,
	MetaSpacecyMysteriousBox,
	MetaSpacecyAssetShared,
	MetaSpacecyTicketCard,
} from "../constant/contract.constant";
import { DEFAULT_CHAIN_ID } from "../constant/default.constant";
import { ExtraItemInfo, Item,Item1, LessItemInfo, property } from "../interfaces/item.interfaces";
import itemModel from "../models/item.model";
import { addIPFS, pinataUploadIPFS, pinataUploadJsonIPFS } from "../utils/uploadIPFS";
import {
	getCollectionAssetERC1155Service,
	getCollectionBoxERC1155Service,
	getCollectionCardService,
	getOneCollectionService,
	getCollectionIdInfoService,
	updateCollectionInfoService,
	getUserAddressCollectionService,
	getIsINOCollectionService
} from "./collection.services";
import { ResponseAPI } from "../interfaces/responseData.interfaces";
import { NULL_ADDRESS } from "../constant/default.constant";
import { createHistoryService } from "../services/history.services";
import { checkUserIsLikeItemService, getInteractionsOfItemService } from "./interactions.services";
import {
	createObjIdService,
	createService,
	deleteObjService,
	findManyService,
	findOneService,
	queryExistService,
	queryItemsOfModelInPageService,
	updateObjService,
	updateOneService,
} from "./model.services";
import { getManyOrderService } from "./Order.services";
import {
	getDataFromURL,
	getSortObj,
	multiProcessService,
	paginateArrayService,
	removeUndefinedOfObj,
} from "./other.services";
import { changePriceService, fromWeiToTokenService, getTokenService } from "./price.services";
import OrderModel from "../models/Order.model";
import { createContractService } from "./web3.services";
import { getWeb3ByChainId } from "./provider.services";
import { getBalanceOfToken1155, getWormholeContractService } from "../services/contract.services";
import { ChainId, SortObjOutput } from "../interfaces/other.interfaces";
import { Token } from "../interfaces/token.interfaces";
import { ListResponseAPI, MongooseObjectId } from "../interfaces/responseData.interfaces";
import { Collection } from "../interfaces/collection.interfaces";
import { Order } from "../interfaces/order.interfaces";
import Web3 from "web3";
import { Types } from "mongoose";
import ticketCardABI from "../abis/MetaSpacecyTicketCard.json";

const createItemService = async (
	itemTokenId: string,
	itemName: string,
	description: string,
	itemMedia: string,
	itemOriginMedia: string,
	itemPreviewMedia: string,
	owner: string[],
	creator: string,
	collectionId: string,
	itemStandard: string,
	chainId: number,
	properties: object,
	price: number,
	priceType: string,
	external_url: string = "",
	metadata: string = "",
): Promise<Item> => {
	const newItem = {
		itemTokenId,
		itemName,
		description,
		itemMedia,
		itemOriginMedia,
		itemPreviewMedia,
		owner,
		creator,
		collectionId: createObjIdService(collectionId),
		itemStandard,
		chainId,
		properties,
		price,
		priceType,
		external_url,
		metadata,
	};

	let item: Item = await createService(itemModel, newItem);
	return item;
};

const getItemIdInPageService = async (
	itemName: string,
	owner: string[],
	creator: string,
	collectionId: string[],
	itemStandard: string,
	status: string[],
	paymentToken: string,
	tokenSymbol: string,
	minPrice: number,
	maxPrice: number,
	sort: string[],
	chainId: number[],
	offer_status: number,
	pageSize: number,
	pageId: number,
): Promise<ListResponseAPI<MongooseObjectId>> => {
	const queryObj = {
		itemName: itemName ? { $regex: itemName, $options: "i" } : undefined,
		owner: owner && owner.length > 0 ? { $in: owner } : undefined,
		creator: creator ? { $regex: creator, $options: "i" } : undefined,
		itemStandard: itemStandard ? { $regex: itemStandard, $options: "i" } : undefined,
		status: status && status.length > 0 ? { $in: status } : undefined,
		collectionId: collectionId && collectionId.length > 0 ? collectionId : undefined,
		chainId: chainId && chainId.length > 0 ? { $in: chainId } : undefined,
		priceType: tokenSymbol ? tokenSymbol.toLowerCase() : undefined,
		offer_status,
		isINO: owner && owner.length > 0 ? undefined : 0,
	};
	
	const listItems: Item[] = await getManyItemService(queryObj, "", getSortObj(sort));
	const idArr: MongooseObjectId[] = [];

	if (paymentToken || tokenSymbol) {
		const token: Token = tokenSymbol
			? await getTokenService({ chainId: DEFAULT_CHAIN_ID, tokenSymbol })
			: await getTokenService({ chainId: DEFAULT_CHAIN_ID, tokenAddress: paymentToken });

		minPrice = minPrice ? minPrice : 0;
		maxPrice = maxPrice ? maxPrice : Number.POSITIVE_INFINITY;
		const queryObjByPriceListing = {
			status: 1,
			priceType: tokenSymbol ? tokenSymbol.toLowerCase() : undefined,
		};
		const listItemsWithPriceListing: Item[] = await getManyItemService(queryObjByPriceListing, "", getSortObj(sort));
		listItemsWithPriceListing.map((item: Item) => {
			let price: number = fromWeiToTokenService(item.price, token.decimal);
			let priceType: string = item.priceType;

			if (priceType === token.tokenSymbol) {
				if (price >= minPrice && price <= maxPrice) {
					idArr.push({ _id: item._id.toString() });
				}
			}
		});
	} else {
		listItems.map((item: Item) => {
			idArr.push({ _id: item._id.toString() });
		});
	}
	let returnItems: ListResponseAPI<MongooseObjectId> = paginateArrayService(idArr, pageSize, pageId);

	return returnItems;
};

const getItemIdInPageDropService = async (
	itemName: string,
	owner: string[],
	creator: string,
	collectionId: string[],
	itemStandard: string,
	status: string[],
	paymentToken: string,
	tokenSymbol: string,
	minPrice: number,
	maxPrice: number,
	sort: string[],
	chainId: number[],
	offer_status: number,
	pageSize: number,
	pageId: number,
): Promise<ListResponseAPI<MongooseObjectId>> => {
	const queryObj = {
		itemName: itemName ? { $regex: itemName, $options: "i" } : undefined,
		owner: owner && owner.length > 0 ? { $in: owner } : undefined,
		creator: creator ? { $regex: creator, $options: "i" } : undefined,
		itemStandard: itemStandard ? { $regex: itemStandard, $options: "i" } : undefined,
		status: status && status.length > 0 ? { $in: status } : undefined,
		collectionId: collectionId && collectionId.length > 0 ? collectionId : undefined,
		chainId: chainId && chainId.length > 0 ? { $in: chainId } : undefined,
		priceType: tokenSymbol ? tokenSymbol.toLowerCase() : undefined,
		offer_status,
		// isINO: owner && owner.length > 0 ? undefined : 1,
	};
	console.log(queryObj)
	const listItems: Item[] = await getManyItemService(queryObj, "", getSortObj(sort));
	const idArr: MongooseObjectId[] = [];

	if (paymentToken || tokenSymbol) {
		const token: Token = tokenSymbol
			? await getTokenService({ chainId: DEFAULT_CHAIN_ID, tokenSymbol })
			: await getTokenService({ chainId: DEFAULT_CHAIN_ID, tokenAddress: paymentToken });

		minPrice = minPrice ? minPrice : 0;
		maxPrice = maxPrice ? maxPrice : Number.POSITIVE_INFINITY;
		const queryObjByPriceListing = {
			status: 1,
			priceType: tokenSymbol ? tokenSymbol.toLowerCase() : undefined,
		};
		const listItemsWithPriceListing: Item[] = await getManyItemService(queryObjByPriceListing, "", getSortObj(sort));
		listItemsWithPriceListing.map((item: Item) => {
			let price: number = fromWeiToTokenService(item.price, token.decimal);
			let priceType: string = item.priceType;

			if (priceType === token.tokenSymbol) {
				if (price >= minPrice && price <= maxPrice) {
					idArr.push({ _id: item._id.toString() });
				}
			}
		});
	} else {
		listItems.map((item: Item) => {
			idArr.push({ _id: item._id.toString() });
		});
	}
	let returnItems: ListResponseAPI<MongooseObjectId> = paginateArrayService(idArr, pageSize, pageId);

	return returnItems;
};

const getSearchItemIdInPageService = async (
	text: string,
	pageSize: number,
	pageId: number,
	sort: string[],
): Promise<ListResponseAPI<Item>> => {
	const queryObj = {
		$or: [{ description: { $regex: text, $options: "i" } }, { itemName: { $regex: text, $options: "i" } }],
		isINO: false,
	};

	const listItems: ListResponseAPI<Item> = await queryItemsOfModelInPageService(
		itemModel,
		queryObj,
		pageId,
		pageSize,
		getSortObj(sort),
	);
	console.log(listItems);
	return listItems;
};

const getItemDetailService = async (
	itemId: string,
	curUserAddress: any,
	detail: boolean = true,
): Promise<ExtraItemInfo | LessItemInfo> => {
	const item: Item = await getOneItemService({ _id: createObjIdService(itemId) });
	const extraItem = await returnAdditionalDetailOfItemService(item, curUserAddress, detail);

	return extraItem;
};

const getSearchItemByIdService = async (itemId: string): Promise<Item> => {
	const item: Item = await findOneService(itemModel, { _id: createObjIdService(itemId) });
	return item;
};

const getItemsByCollectionService = async (collectionId: string): Promise<Item[]> => {
	let items: Item[] = await findManyService(itemModel, { collectionId: createObjIdService(collectionId) });
	return items;
};

const getOneItemService = async (objQuery: any, properties: string = ""): Promise<Item> => {
	objQuery = removeUndefinedOfObj(objQuery);
	const item: Item = await itemModel
		.findOne(objQuery, properties)
		.lean()
		.populate({ path: "collectionInfo" })
		.populate({ path: "ownerInfo", select: "userAddress avatar username" })
		.populate({ path: "creatorInfo", select: "userAddress avatar username" });
	return item;
};

const getManyItemService = async (
	objectQuery: any,
	properties: string = "",
	sorObj: SortObjOutput = { createdAt: -1 },
): Promise<Item[]> => {
	const items: Item[] = await findManyService(itemModel, objectQuery, properties, sorObj);
	return items;
};

const updateItemService = async (
	itemId: string,
	itemName: string,
	description: string,
	itemMedia: string,
	itemOriginMedia: string,
	itemPreviewMedia: string,
): Promise<Item> => {
	const queryObj = {
		_id: createObjIdService(itemId),
	};
	const updateObj = {
		itemName,
		description,
		itemMedia,
		itemOriginMedia,
		itemPreviewMedia,
	};
	const item = await updateOneService(itemModel, queryObj, updateObj);
	return item;
};

const updateOwnerItemService = async (itemId: string, newOwner: string, oldOwner: string = "") => {
	const item: Item = await getOneItemService({ _id: itemId });
	let owners: string[] = item.owner;
	//ERC-721
	if (item.itemStandard === "ERC721") {
		owners.pop();
		owners.push(newOwner);
	}
	//ERC1155
	else {
		const balance: number = (await getBalanceOfToken1155(item, oldOwner)) || 0;
		owners.push(newOwner);

		if (balance === 0) {
			owners = owners.filter((owner: any) => owner !== oldOwner.toLowerCase());
		}
	}
	owners = [...new Set(owners)];
	const result: Item = await updateOneService(itemModel, { _id: itemId }, { owner: owners });
	return result;
};

const checkCreatorItemService = async (itemId: string, creator: string): Promise<boolean> => {
	const item: Item = await findOneService(itemModel, { _id: createObjIdService(itemId) });
	return item.creator === creator ? (item.owner.includes(creator) ? true : false) : false;
};

const checkItemIsFreezeService = async (itemId: string): Promise<boolean> => {
	const result = await findOneService(itemModel, { _id: createObjIdService(itemId) });
	return result.isFreeze;
};

const checkIsBaseItemService = async (itemId: string): Promise<boolean> => {
	const item: Item = await findOneService(itemModel, { _id: itemId });
	const collection: Collection = await getOneCollectionService({ _id: item.collectionId });
	return collection.collectionAddress === MetaSpacecyAssetShared[collection.chainId].toLowerCase();
};

const checkItemExistsService = async (queryObj: object): Promise<boolean> => {
	return await queryExistService(itemModel, queryObj);
};

const getMetadataService = async (itemId: string): Promise<{ tokenId: string, cid: string }> => {
	const item: Item = await getOneItemService({ _id: itemId });
	const metadata = {
		name: item.itemName,
		description: item.description,
		image: item.itemOriginMedia,
		properties: item.properties,
	};

	//---OLD---
	// const file = await addIPFS(JSON.stringify(metadata));

	//---NEW---
	const ipfs = await pinataUploadJsonIPFS(JSON.stringify(metadata));

	return { tokenId: item.itemTokenId, cid: ipfs };
};

const freezeItemService = async (itemId: string, metadata: string) => {
	const result = await itemModel.updateOne({ _id: itemId }, { isFreeze: true, metadata });
	console.log("result: ", result);
	return result;
};

const updatePropertiesService = async (itemId: string, properties: property[]) => {
	for (let i = 0; i < properties.length; i++) {
		await updateObjService(itemModel, { _id: itemId }, "properties", properties[i].property, properties[i].value);
	}
};

const deletePropertiesService = async (itemId: string, properties: string[]) => {
	for (let i = 0; i < properties.length; i++) {
		await deleteObjService(itemModel, { _id: itemId }, "properties", properties[i]);
	}
};

const returnUSDPriceService = async (priceType: string, price: string): Promise<{ usdPrice: number }> => {
	const usdPrice = await changePriceService(priceType, "usd", price);
	return { usdPrice: usdPrice };
};

const returnAdditionalDetailOfItemService = async (
	item: Item,
	userAddress: string,
	getDetail: boolean = true,
): Promise<LessItemInfo | ExtraItemInfo> => {
	let itemInfo: LessItemInfo | ExtraItemInfo;
	const getOrderItem = async () => {
		const result = await getManyOrderService({ itemId: item._id });
		return { orders: result };
	};
	item.isBox = item.collectionInfo.category === 7;
	let price: string = item.price;
	let priceType: string = item.priceType;
	const token: Token = await getTokenService({ chainId: item.chainId, tokenSymbol: priceType });

	if (getDetail === true) {
		const obj = await multiProcessService([
			getOrderItem(),
			checkUserIsLikeItemService(userAddress, item._id.toString()),
			getInteractionsOfItemService(item._id),
			returnUSDPriceService(priceType, price),
		]);

		itemInfo = {
			...item,
			interaction: obj.itemInteraction,
			currentPrice: fromWeiToTokenService(price, token?.decimal),
			priceLogo: token?.logoURI,
			usdPrice: obj.usdPrice,
			isLike: obj.isLike,
			order: obj.orders,
		};
	} else {
		const obj = await multiProcessService([
			getInteractionsOfItemService(item._id),
			returnUSDPriceService(priceType, price),
			checkUserIsLikeItemService(userAddress, item._id.toString()),
		]);

		itemInfo = {
			...item,
			interaction: obj.itemInteraction,
			currentPrice: fromWeiToTokenService(price, token.decimal),
			priceLogo: token.logoURI,
			usdPrice: obj.usdPrice,
			isLike: obj.isLike,
		};
	}
	return itemInfo;
};

const updateStatusItemService = async (itemId: Types.ObjectId, objUpdate: any): Promise<void> => {
	// fix function
	return await updateOneService(itemModel, { _id: itemId, type: 0 }, { ...objUpdate });
};

const checkItemStatusService = async (itemId: Types.ObjectId, typeOrder: number): Promise<Order> => {
	let order: Order;
	order = await findOneService(OrderModel, { itemId, type: typeOrder });
	return order;
};

const checkItemOfferStatusService = async (itemId: string): Promise<Order> => {
	const order: Order = await findOneService(OrderModel, { itemId: createObjIdService(itemId), type: 1 });

	return order;
};

const getListItemsSellingService = async (chainId: ChainId): Promise<Item[]> => {
	const listItems: Item[] = await findManyService(itemModel, { chainId, status: { $ne: 0 } }, "_id", {
		listingPrice: 1,
	});
	return listItems;
};

const checkOwnerItemService = async (userAddress: string, itemId: string): Promise<Item> => {
	const item: Item = await findOneService(itemModel, { _id: createObjIdService(itemId), owner: userAddress });
	return item;
};

const updatePriceItemService = async (itemId: string, objUpdate: any): Promise<Item> => {
	const item: Item = await updateOneService(itemModel, { _id: itemId }, { ...objUpdate });
	return item;
};

//BOX
const getAsset1155 = async (chainId: ChainId) => {
	const collectionAsset = await getCollectionAssetERC1155Service(chainId);
	const items = await itemModel.find({ collectionId: collectionAsset._id }).populate({ path: "collectionInfo" }).lean();
	const wormhole = getWormholeContractService(chainId);
	const returnItem: any = [];
	for (let i = 0; i < items.length; i++) {
		let upgradeFee = 0;
		try {
			upgradeFee = await wormhole.methods.UPGRADE_FEE(parseInt(items[i].itemTokenId)).call();
		} catch (error) {}
		items[i].isBox = items[i].collectionInfo?.category === 7;
		const item = {
			...items[i],
			upgradeFee,
		};
		returnItem.push(item);
	}
	return returnItem;
};

const getBoxService = async (chainId: ChainId) => {
	const collectionBox = await getCollectionBoxERC1155Service(chainId);
	const items = await itemModel
		.find({ collectionId: collectionBox._id })
		.lean()
		.populate({ path: "collectionInfo" })
		.lean();

	for (let i = 0; i < items.length; i++) {
		items[i].isBox = items[i].collectionInfo.category === 7;
	}
	return items;
};

const getBoxAssetService = async (
	chainId: ChainId,
	pageId: number,
	pageSize: number,
	type: number[] = [0, 1, 2],
): Promise<ListResponseAPI<Item>> => {
	const collectionBox = async () => {
		const result = await getCollectionBoxERC1155Service(chainId);
		return { collectionBox: result };
	};
	const collectionAsset = async () => {
		const result = await getCollectionAssetERC1155Service(chainId);
		return { collectionAsset: result };
	};
	const collectionTicketCard = async () => {
		const result = await getCollectionCardService(chainId);
		return { collectionTicketCard: result };
	};
	const arrayFunction: any = [];
	if (type.includes(0)) {
		arrayFunction.push(collectionBox());
	}
	if (type.includes(1)) {
		arrayFunction.push(collectionAsset());
	}
	if (type.includes(2)) {
		arrayFunction.push(collectionTicketCard());
	}
	const result = await multiProcessService(arrayFunction);

	const items: ListResponseAPI<Item> = await queryItemsOfModelInPageService(
		itemModel,
		{ collectionId: Object.values(result) },
		pageId,
		pageSize,
	);
	return items;
};

const getBox1155 = async (chainId: ChainId): Promise<void> => {
	const web3: Web3 = getWeb3ByChainId(chainId);
	const contract = createContractService(web3, MetaSpacecyMysteriousBox[chainId], box1155ABI);
	const collection: Collection = await getOneCollectionService({
		collectionAddress: MetaSpacecyMysteriousBox[chainId],
	});
	for (let tokenId = 0; tokenId < 6; tokenId++) {
		const check: Item = await getOneItemService({ collectionId: collection._id, itemTokenId: tokenId });
		if (!check) {
			const tokenURI: string = await contract.methods.tokenURI(tokenId).call();
			const metadata = await getDataFromURL(tokenURI);
			const newObj = {
				itemTokenId: tokenId,
				itemName: metadata.name,
				description: metadata.description,
				properties: metadata.properties,
				itemMedia: metadata.image,
				itemOriginMedia: metadata.image,
				itemPreviewMedia: metadata.image,
				isFreeze: true,
				creator: collection.userAddress,
				collectionId: collection._id,
				itemStandard: "ERC1155",
				chainId,
				metadata: tokenURI,
			};
			let item = await createService(itemModel, newObj);
			await item.save();
		}
	}
};

const getItem1155 = async (chainId: ChainId): Promise<void> => {
	const web3: Web3 = getWeb3ByChainId(chainId);
	const contract = createContractService(web3, MetaSpacecyCreatureAccessory[chainId], AssetERC1155ABI);
	const collection: Collection = await getOneCollectionService({
		collectionAddress: MetaSpacecyCreatureAccessory[chainId],
	});
	for (let tokenId = 0; tokenId < 6; tokenId++) {
		const check: Item = await getOneItemService({ collectionId: collection._id, itemTokenId: tokenId });
		if (!check) {
			const tokenURI: string = await contract.methods.tokenURI(tokenId).call();
			const metadata = await getDataFromURL(tokenURI);
			const newObj = {
				itemTokenId: tokenId,
				itemName: metadata.name,
				description: metadata.description,
				properties: metadata.properties,
				itemMedia: metadata.image,
				itemOriginMedia: metadata.image,
				itemPreviewMedia: metadata.image,
				isFreeze: true,
				creator: collection.userAddress,
				collectionId: collection._id,
				itemStandard: "ERC1155",
				chainId,
				metadata: tokenURI,
			};
			let item = await createService(itemModel, newObj);
			await item.save();
		}
	}
};

const getTicketCardService = async (collectionCard: Collection) => {
	const web3 = getWeb3ByChainId(collectionCard.chainId);
	const cardContract = createContractService(web3, MetaSpacecyTicketCard[collectionCard.chainId], ticketCardABI);
	const currentCardId = await cardContract.methods.currentIdSupported().call();
	let cardItem: Item = await itemModel.findOne({ collectionId: collectionCard._id, itemTokenId: currentCardId });
	if (!cardItem) {
		const tokenURI = await cardContract.methods.tokenURI(currentCardId).call();
		const data = await getDataFromURL(tokenURI);
		cardItem = await createService(itemModel, {
			itemTokenId: currentCardId,
			itemName: data.name,
			description: data.description,
			itemMedia: data.image,
			itemOriginMedia: data.image,
			itemPreviewMedia: data.image,
			metadata: tokenURI,
			properties: data.properties,
			creator: collectionCard.userAddress,
			collectionId: collectionCard._id,
			itemStandard: collectionCard.collectionStandard,
			chainId: collectionCard.chainId,
			isFreeze: true,
		});
	}
	return cardItem;
};
//Get Item By ItemId and CollectionId
const checkOwnerInItemService = async(itemTokenId: String, collectionId: String, userAddress: String) => {
	const getItem = await itemModel.find({itemTokenId: itemTokenId, collectionId: collectionId})
	let check = true
	for(let i = 0; i < getItem[0]?.owner.length; i++ ){
		if(getItem[0]?.owner[i] === userAddress){
			check = false 
		}
	}
	return check
} 
//Get Item By CollectionId
const getItemByIDCollectionService = async(collectionId: String) => {
	const getItem: Item1[] = await itemModel.find({collectionId: collectionId})
	return getItem
} 
const updateINOItemService = async (queryUpdate: Object, updateTotal: Object) => {
	const update: Item1 = await updateOneService(itemModel, queryUpdate, updateTotal)
	return update;
}

//Update Owner Item 1155
const updateOwnerItem1155Service = async(itemTokenId: String, collectionId: String, userAddress: String) => {
	let check = true
	const getItem: Item1[] = await itemModel.find({itemTokenId: itemTokenId, collectionId: collectionId})  
	// console.log(getItem[0].itemStandard)
	if(getItem[0].itemStandard === "ERC721"){
		const getItem721: Item1[] = await itemModel.find({collectionId: collectionId})
		for(let i = 0; i < getItem721.length; i++ ){
			if(getItem721[i].owner[0] === userAddress){
				check = false 
			}
		}
	} else{
		for(let i = 0; i < getItem[0].owner.length; i++ ){
			if(getItem[0]?.owner[i] === userAddress){
				check = false 
			}
		}
	}
	let owner: any = getItem[0].owner
	// console.log(check)
	// if(check === true){		
	owner[Number(getItem[0].owner.length)] = userAddress
	// }
	await updateOneService(itemModel, {collectionId, itemTokenId}, {owner})
	return check
}

// Custom CreateItemService
const createItemCustomService = async (
	itemTokenId: string,
	itemName: string,
	description: string,
	itemMedia: string,
	itemOriginMedia: string,
	itemPreviewMedia: string,
	creator: string,
	collectionId: string,
	itemStandard: string,
	chainId: number,
	price: number,
	priceType: string,
): Promise<Item> => {
	const newItem = {
		itemTokenId,
		itemName,
		description,
		itemMedia,
		itemOriginMedia,
		itemPreviewMedia,
		creator,
		collectionId: createObjIdService(collectionId),
		itemStandard,
		chainId,
		price,
		priceType,
	};

	let item: Item = await createService(itemModel, newItem);
	return item;
};
// Create Item
const createItemDropService = async (
	collectionId: string,
	itemName: string,
	description: string,
	itemMedia: string,
	itemOriginMedia: string,
	itemPreviewMedia: string,
	price: number,
	priceType: string,
	itemTokenId: string,
	image: string,
	totalItem: number,
	) => {
		const txHash =  ""
		const collection: Collection = await getOneCollectionService({ _id: createObjIdService(collectionId) });
		const collectionInfo = await getCollectionIdInfoService(collectionId)
		const item: any = collectionInfo.item
		const productId = (Number(collectionInfo.item.length)+1).toString()
		const availableItem = totalItem
		const update: Object = {
			productId,
			itemTokenId,
			itemName,
			image,
			totalItem,
			availableItem
		}
		
		item[Number(collectionInfo.item.length)] = update
		const totalNFT = Number(collectionInfo.totalNFT)+totalItem
		const availableNFT = Number(collectionInfo.availableNFT) + availableItem
		//Create on database
		const item1: Item = await createItemCustomService(
			itemTokenId,
			itemName,
			description,
			itemMedia,
			itemOriginMedia,
			itemPreviewMedia,
			collection.userAddress,
			collection._id.toString(),
			collection.collectionStandard,
			Number(collection.chainId),
			price,
			priceType,
		);

		await updateCollectionInfoService({collectionId}, { totalNFT, availableNFT, item } )
		await createHistoryService(collection._id, item1._id, NULL_ADDRESS, collection.userAddress, price.toString(), priceType, totalItem, txHash, 1);

		const response: ResponseAPI<Item> = {
			data: item1,
		};
		return (response);
};

// 	item[Number(collectionInfo.item.length)] = update;
// 	const totalNFT = Number(collectionInfo.totalNFT) + totalItem;
// 	const availableNFT = Number(collectionInfo.availableNFT) + availableItem;
// 	//Create on database
// 	const item1: Item = await createItemService1(
// 		itemTokenId,
// 		itemName,
// 		description,
// 		itemMedia,
// 		itemOriginMedia,
// 		itemPreviewMedia,
// 		collection.userAddress,
// 		collection._id.toString(),
// 		collection.collectionStandard,
// 		Number(collection.chainId),
// 		price,
// 		priceType,
// 	);

// 	await updateCollectionInfo({ collectionId }, { totalNFT, availableNFT, item });
// 	await createHistoryService(
// 		collection._id,
// 		item1._id,
// 		NULL_ADDRESS,
// 		collection.userAddress,
// 		price.toString(),
// 		priceType,
// 		totalItem,
// 		txHash,
// 		1,
// 	);

// 	const response: ResponseAPI<Item> = {
// 		data: item1,
// 	};
// 	return response;
// };

export {
	createItemService,
	getItemDetailService,
	updateItemService,
	getOneItemService,
	getManyItemService,
	checkItemIsFreezeService,
	checkItemExistsService,
	getMetadataService,
	freezeItemService,
	updatePropertiesService,
	deletePropertiesService,
	checkIsBaseItemService,
	changePriceService,
	updateOwnerItemService,
	checkCreatorItemService,
	updateStatusItemService,
	getListItemsSellingService,
	checkOwnerItemService,
	updatePriceItemService,
	getItemIdInPageService,
	getSearchItemIdInPageService,
	getSearchItemByIdService,
	getBoxAssetService,
	getItemsByCollectionService,
	checkItemStatusService,
	checkItemOfferStatusService,
	getBox1155,
	getItem1155,
	getAsset1155,
	getBoxService,
	getTicketCardService,
/*-----------Add Service----------------*/
	updateOwnerItem1155Service,
	createItemCustomService,
	createItemDropService,
	checkOwnerInItemService,
	getItemIdInPageDropService,
	getItemByIDCollectionService,
	updateINOItemService
};

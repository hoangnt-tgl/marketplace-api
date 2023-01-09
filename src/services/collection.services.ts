import {
	MetaSpacecyCreatureAccessory,
	MetaSpacecyMysteriousBox,
	MetaSpacecyAssetShared,
	MetaSpacecyTicketCard,
	BoarcDrop,
} from "../constant/contract.constant";
import collectionModel from "../models/collection.model";
import {
	createObjIdService,
	createService,
	findManyService,
	findOneService,
	queryItemsOfModelInPageService,
	updateOneService,
} from "./model.services";
import { queryExistService } from "./model.services";
import { getSortObj, multiProcessService, paginateArrayService, removeUndefinedOfObj } from "./other.services";
import { getHistoryTradeByDayService } from "../services/history.services";
import { changePriceService } from "../services/price.services";
import itemModel from "../models/item.model";
import historyModel from "../models/history.model";
/*------------@Dev:Huy-----------------*/
import collectionInfo from "../models/collectionInfo.model";
import { CollectionInfo, ItemCollectionInfo } from "../interfaces/collectionInfo.interfaces"

import fs from "fs";
import { CATEGORY } from "../constant/collection.constant";
import { NULL_ADDRESS, DEFAULT_NAME } from "../constant/default.constant";
import {
	Collection,
	ExtraInfoCollection,
	LessInfoCollection,
	TopCollection,
} from "../interfaces/collection.interfaces";
import { ListResponseAPI, MongooseObjectId } from "../interfaces/responseData.interfaces";
import { Types } from "mongoose";
import { ChainId } from "../interfaces/other.interfaces";
import { Item } from "../interfaces/item.interfaces";
import users from "../models/user.model"
import { User } from "../interfaces/user.interfaces"
import { updateOwnerItem1155Service,} from "../services/item.services"
import Web3 from "web3";
import { abi } from "../abis/boarc721.json";
import { getManyHistoryService } from "./history.services";
import { History, HistoryTrade } from "../interfaces/history.interfaces";
import { async } from "@firebase/util";

const createCollectionIfNotExistService = async (
	userAddress: string,
	logo: string,
	background: string,
	collectionName: string,
	chainId: ChainId,
	collectionStandard: string,
	description: string,
	royalties: number,
	category: number,
): Promise<Collection> => {
	const collectionAddress: string = MetaSpacecyAssetShared[chainId];
	const queryObj = { collectionAddress, collectionName, chainId };

	const check: boolean = await checkCollectionExistsService(chainId, collectionAddress, collectionName);
	const newCollection = {
		collectionAddress,
		userAddress,
		logo,
		background,
		collectionName,
		chainId,
		collectionStandard,
		description,
		royalties,
		category,
	};
	const collection: Collection = check
		? await findOneService(collectionModel, queryObj)
		: await createService(collectionModel, newCollection);

	return collection;
};

const checkCollectionExistsService = async (
	chainId: ChainId,
	collectionAddress: string,
	collectionName: string,
): Promise<boolean> => {
	const result: boolean = await queryExistService(collectionModel, { chainId, collectionAddress, collectionName });
	return result;
};

const checkCollectionExistsByIdService = async (collectionId: string): Promise<boolean> => {
	const result: boolean = await queryExistService(collectionModel, { _id: createObjIdService(collectionId) });
	return result;
};

const updateCollectionService = async (
	collectionId: string,
	logo: string,
	background: string,
	description: string,
	collectionName: string,
	category: number,
): Promise<Collection> => {
	const objectQuery = { _id: createObjIdService(collectionId) };
	const objectUpdate = {
		logo,
		background,
		description,
		collectionName,
		category,
	};

	const collection: Collection = await updateOneService(collectionModel, objectQuery, objectUpdate);

	return collection;
};

const getListCollectionsByCategoryService = async (typeCategory: number, pageId: number, pageSize: number) => {
	const collections = await findManyService(collectionModel, { category: typeCategory }, "_id");
	const returnCollections = paginateArrayService(collections, pageSize, pageId);
	return returnCollections;
};

const queryCollectionIdsInPageService = async (
	pageSize: number,
	page: number,
	chainId: ChainId[],
	userAddress: string = "",
	collectionName: string = "",
	collectionStandard: string = "",
	sort: string[] = [],
	category: number[],
): Promise<ListResponseAPI<MongooseObjectId>> => {
	const response: ListResponseAPI<MongooseObjectId> = await queryItemsOfModelInPageService(
		collectionModel,
		{
			chainId: chainId && chainId.length > 0 ? chainId : undefined,
			userAddress: userAddress ? userAddress : undefined,
			collectionName: collectionName ? { $regex: collectionName, $options: "i" } : undefined,
			collectionStandard: collectionStandard ? collectionStandard : undefined,
			isINO: userAddress ? undefined : false,
			category: category && category.length > 0 ? category : undefined,
		},
		page,
		pageSize,
		getSortObj(sort),
		"_id",
	);
	return response;
};

const querySearchCollectionService = async (
	text: string,
	pageSize: number,
	page: number,
	sort: string[],
): Promise<ListResponseAPI<MongooseObjectId>> => {
	const objQuery = {
		$or: [{ collectionAddress: { $regex: text, $options: "i" } }, { collectionName: { $regex: text, $options: "i" } }],
	};
	const collections: ListResponseAPI<MongooseObjectId> = await queryItemsOfModelInPageService(
		collectionModel,
		{...objQuery, collectionAddress: {$ne: process.env.BOARC_ADDRESS}},
		page,
		pageSize,
		getSortObj(sort),
		"_id",
	);
	return collections;
};

const getCollectionByIdService = async (
	collectionId: string,
	lessInfo: boolean = true,
): Promise<LessInfoCollection | Collection> => {
	if (lessInfo) {
		const collection: LessInfoCollection = await getLessInfoCollectionService(createObjIdService(collectionId));
		return collection;
	} else {
		const collection: Collection = await findOneService(collectionModel, { _id: createObjIdService(collectionId) });
		return collection;
	}
};

const getCollectionDetailService = async (collectionId: string): Promise<ExtraInfoCollection> => {
	const collection: ExtraInfoCollection = await getExtraInfoCollectionService(createObjIdService(collectionId));
	return collection;
};

const getOneCollectionService = async (objQuery: any, properties: any = ""): Promise<Collection> => {
	const collection: Collection = await collectionModel.findOne(objQuery, properties).populate("ownerInfo");
	return collection;
};

const getCollectionTradeByDayService = async (
	collectionId: Types.ObjectId,
	fromDate: number,
	toDate: number,
): Promise<number> => {
	const histories = await getHistoryTradeByDayService(fromDate, toDate, {
		collectionId,
		type: 3,
	});
	let result: number = 0;
	histories.map((history: any) => {
		result += history.usdPrice;
	});
	return result;
};

const writeTopCollectionService = async (): Promise<void> => {
	try {

		const collections: Collection[] = await findManyService(
			collectionModel,
			{ volumeTrade: { $ne: 0 }},
		);
		let listChainId: Array<Number> = collections.map(collection => collection.chainId)
		listChainId = Array.from(new Set(listChainId))
		let topCollection: any = {};
		await Promise.all(listChainId.map(async (chainId) => {
			let listCollection:any = {}
			await Promise.all(
				collections.map(async (collection: Collection) => {
					console.log(collection)
					if(collection.chainId == chainId){
						console.log(1);
						listCollection[String(collection._id)] = await getExtraInfoCollectionService(collection._id);
					}
				}),
			);
			topCollection[String(chainId)] = listCollection
		})
		)
		console.log(topCollection)
	

		
		// await Promise.all(
		// 	collections.map(async (collection: Collection) => {
		// 		 topCollection[String(collection._id)] = await getExtraInfoCollectionService(collection._id);
		// 	}),
		// );
		fs.writeFile("./public/topCollection.json", JSON.stringify(topCollection), "utf8", () => {
			console.log(`Update top collection successfully at ${new Date(Date.now())}`);
		});
	} catch (error: any) {
		console.log(error.message);
	}
};

const getTopCollectionService = async (
	sortBy:
		| "volumeTrade"
		| "floorPrice"
		| "volume24Hour"
		| "volume7Days"
		| "volume30Days"
		| "percent24Hour"
		| "percent7Days"
		| "percent30Days" = "volumeTrade",
	sortFrom: "desc" | "asc" = "desc",
	objectQuery: any = {},
	pageSize: number,
	pageId: number,
): Promise<ListResponseAPI<ExtraInfoCollection[]>> => {
	objectQuery = removeUndefinedOfObj(objectQuery);
	const folder = fs.readdirSync("./public");
	if (!folder.includes("topCollection.json")) {
		fs.writeFile("./public/topCollection.json", "", "utf8", () => {
			console.log(`Update top collection successfully at ${new Date(Date.now())}`);
		});
	}
	const file: any = fs.readFileSync("./public/topCollection.json");
	const topCollection: ExtraInfoCollection = JSON.parse(file);
	const sortable = Object.entries(topCollection).filter(([, value]: any) => {
		let result: boolean = true;
		let queryKeys = Object.keys(objectQuery);
		queryKeys.forEach((key: string) => {
			result = result && value[key] === objectQuery[key];
		});
		return result;
	});
	let returnValue: any = [];
	if (sortFrom === "desc") {
		returnValue = sortable
			.sort(([, value1]: any, [, value2]: any) => value2[sortBy] - value1[sortBy])
			.reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
	} else {
		returnValue = sortable
			.sort(([, value1]: any, [, value2]: any) => value1[sortBy] - value2[sortBy])
			.reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
	}
	const result: ListResponseAPI<ExtraInfoCollection[]> = paginateArrayService(
		Object.values(returnValue),
		pageSize,
		pageId,
	);
	return result;
};

const getCategoryCollectionService = async () => {
	const categories: { key: number, data: MongooseObjectId[] }[] = [];
	let other: any;
	const LIMITED_ITEMS: Number = Number(process.env.LIMITED_ITEMS) || 4;
	const multiProcess = CATEGORY.map(async (obj: { key: number, type: string }) => {
		const collections: MongooseObjectId[] = await collectionModel
			.find({ category: obj.key, userAddress: { $ne: NULL_ADDRESS } }, "_id")
			.sort({ volumeTrade: -1 });

		if (collections.length >= LIMITED_ITEMS) {
			if (obj.key === 0) {
				other = {
					key: obj.key,
					data: collections,
				};
			} else {
				categories.push({
					key: obj.key,
					data: collections,
				});
			}
		}
	});

	await Promise.all(multiProcess);

	if (other) {
		categories.push(other);
	}

	return categories;
};

const checkIsBaseCollectionService = async (chainId: ChainId, collectionId: string): Promise<boolean> => {
	const collection: Collection = await getOneCollectionService({ _id: collectionId });
	return collection.collectionAddress === MetaSpacecyAssetShared[chainId].toLowerCase();
};

const checkIsOwnerOfCollectionService = async (collectionId: string, userAddress: string): Promise<boolean> => {
	const collection: Collection = await getOneCollectionService({ _id: collectionId });
	return collection.userAddress === userAddress;
};

const updateVolumeTradedService = async (collectionId: Types.ObjectId, price: number): Promise<void> => {
	await collectionModel.findOneAndUpdate({ _id: collectionId }, { $inc: { volumeTrade: price } });
};

const getAllCollectionsService = async (): Promise<Collection[]> => {
	const collections: Collection[] = await findManyService(
		collectionModel,
		{},
		"_id collectionAddress collectionName logo isConfirm",
	);
	return collections;
};

const getCollectionsByOwnerItemsService = async (
	userAddress: string,
	chainId: ChainId[],
	collectionName: string = "",
	collectionStandard: string = "",
	category: number[],
	pageSize: number,
	page: number,
	isGetByOwnerItem: boolean = true,
	isGetByCreatorItem: boolean = true,
): Promise<ListResponseAPI<MongooseObjectId[]>> => {
	const queryObj = {
		collectionName: collectionName ? { $regex: collectionName, $options: "i" } : undefined,
		collectionStandard: collectionStandard ? { $regex: collectionStandard, $options: "i" } : undefined,
		chainId: chainId && chainId.length > 0 ? chainId : undefined,
		category: category && category.length > 0 ? category : undefined,
	};

	if (isGetByOwnerItem && isGetByCreatorItem) {
		const items = async () => {
			const result = await itemModel
				.find(
					removeUndefinedOfObj({
						$or: [{ owner: userAddress }, { creator: userAddress }],
						chainId: chainId && chainId.length > 0 ? chainId : undefined,
					}),
					"collectionId",
				)
				.populate("collectionId");
			return {
				items: result,
			};
		};
		const collections = async () => {
			const result = await findManyService(collectionModel, removeUndefinedOfObj({ userAddress, ...queryObj }), "_id");
			return { collections: result };
		};

		const result = await multiProcessService([items(), collections()]);

		const collectionsOwnItem: MongooseObjectId[] = result.items.reduce(
			(collectionArr: MongooseObjectId[], current: any) => {
				const condition1: boolean = collectionName ? current.collectionId.collectionName.match(collectionName) : true;
				const condition2: boolean = collectionStandard
					? current.collectionId.collectionStandard === collectionStandard
					: true;
				const condition3: boolean = category ? current.collectionId.category === category : true;

				if (condition1 && condition2 && condition3) {
					const collectionId: string = current.collectionId._id.toString();
					const check = collectionArr.some((element: MongooseObjectId) => element._id === collectionId);
					if (!check) {
						collectionArr.push({ _id: collectionId });
					}
				}
				return collectionArr;
			},
			[],
		);

		result.collections.map((collection: MongooseObjectId) => {
			const check: boolean = collectionsOwnItem.some(
				(element: MongooseObjectId) => element._id === collection._id.toString(),
			);
			if (!check) {
				collectionsOwnItem.push({ _id: collection._id.toString() });
			}
		});

		return paginateArrayService(collectionsOwnItem, pageSize, page);
	} else if (isGetByOwnerItem && !isGetByCreatorItem) {
		const items = async () => {
			const result = await itemModel
				.find(
					removeUndefinedOfObj({
						owner: userAddress,
						chainId: chainId && chainId.length > 0 ? chainId : undefined,
					}),
					"collectionId",
				)
				.populate("collectionId");
			return {
				items: result,
			};
		};
		const result = await multiProcessService([items()]);

		const collectionsOwnItem: MongooseObjectId[] = result.items.reduce(
			(collectionArr: MongooseObjectId[], current: any) => {
				const condition1: boolean = collectionName ? current.collectionId.collectionName.match(collectionName) : true;
				const condition2: boolean = collectionStandard
					? current.collectionId.collectionStandard === collectionStandard
					: true;
				const condition3: boolean = category ? current.collectionId.category === category : true;

				if (condition1 && condition2 && condition3) {
					const collectionId: string = current.collectionId._id.toString();
					if (!collectionArr.includes({ _id: collectionId })) {
						collectionArr.push({ _id: collectionId });
					}
				}
				return collectionArr;
			},
			[],
		);

		return paginateArrayService(collectionsOwnItem, pageSize, page);
	} else {
		const collections: MongooseObjectId[] = await findManyService(collectionModel, { userAddress, ...queryObj }, "_id");
		return paginateArrayService(collections, pageSize, page);
	}
};

const checkCollectionIsConfirmService = async (collectionId: Types.ObjectId): Promise<boolean> => {
	const collection = await getOneCollectionService({ _id: collectionId });
	return collection.isConfirm;
};

const getLessInfoCollectionService = async (collectionId: Types.ObjectId): Promise<LessInfoCollection> => {
	const collection = await collectionModel
		.findById(collectionId)
		.populate({ path: "ownerInfo", select: "userAddress avatar username" })
		.lean();
	const items = await findManyService(itemModel, { collectionId: collectionId }, "itemMedia itemPreviewMedia");
	const lessCollection = {
		...collection,
		listItem: items.slice(0, 4),
		items: items.length,
	};
	return lessCollection;
};

const getExtraInfoCollectionService = async (collectionId: Types.ObjectId): Promise<ExtraInfoCollection> => {
	const collection = await collectionModel
		.findById(collectionId)
		.populate({ path: "ownerInfo", select: "userAddress avatar username" })
		.lean();
	//add totalItem
	let totalItem = 0;
	const countItemOfCollectionService = async () => {
		const items = await findManyService(itemModel, { collectionId: collectionId }, "owner itemMedia itemPreviewMedia");
		// const numberOfOwner = [...new Map(items.map((item: any) => [item["owner"], item])).values()].length;
		const trackItems: any[] = [];
		 items.forEach((ele: Item) => {
			trackItems.push(ele.owner);
		});
		const mergeDedupe = [...new Set([].concat(...trackItems))];
		//get total Item
		totalItem = Number(items.length);
		return {
			itemInfo: {
				items: items,
				owners: mergeDedupe.length,
			},
		};
	};
	
	const getFloorPriceOfCollectionService = async () => {
		let listTransferHistories = await findManyService(
			historyModel,
			{
				collectionId: collectionId,
				type: { $eq: 3 },
			},
			"price priceType",
		);
		let priceArr: any = [];
		await Promise.all(
			listTransferHistories.map(async (his: any) => {
				let usdPrice = await changePriceService(his.priceType, "usd", his.price);
				priceArr.push(usdPrice);
			}),
		);

		if (priceArr.length === 0) {
			return {
				floorPrice: 0,
			};
		}

		priceArr.sort((a: any, b: any) => {
			return a - b;
		});

		let minPrice = priceArr[0];

		return {
			floorPrice: collection?.volumeTrade < minPrice ? collection?.volumeTrade : minPrice,
		};
	};

	const getTradeByDay = async () => {
		const now = Date.now();
		const curDay = now - 24 * 3600 * 1000;
		const lastDay = curDay - 24 * 3600 * 1000;

		const newVolume = await getCollectionTradeByDayService(collectionId, curDay, now);
		const oldVolume = await getCollectionTradeByDayService(collectionId, lastDay, curDay);
		return {
			day: {
				volumeTradeByDay: newVolume,
				percentByDay: oldVolume > 0 ? ((newVolume - oldVolume) / oldVolume) * 100 : 0,
			},
		};
	};

	const getTradeByWeek = async () => {
		const now = Date.now();
		const curWeek = now - 7 * 24 * 3600 * 1000;
		const lastWeek = curWeek - 7 * 24 * 3600 * 1000;

		const newVolume = await getCollectionTradeByDayService(collectionId, curWeek, now);
		const oldVolume = await getCollectionTradeByDayService(collectionId, lastWeek, curWeek);

		return {
			week: {
				volumeTradeByWeek: newVolume,
				percentByWeek: oldVolume > 0 ? ((newVolume - oldVolume) / oldVolume) * 100 : 0,
			},
		};
	};

	const getTradeByMonth = async () => {
		const now = Date.now();
		const curMonth = now - 30 * 24 * 3600 * 1000;
		const lastMonth = curMonth - 30 * 24 * 3600 * 1000;

		const newVolume = await getCollectionTradeByDayService(collectionId, curMonth, now);
		const oldVolume = await getCollectionTradeByDayService(collectionId, lastMonth, curMonth);

		return {
			month: {
				volumeTradeByMonth: newVolume,
				percentByMonth: oldVolume > 0 ? ((newVolume - oldVolume) / oldVolume) * 100 : 0,
			},
		};
	};

	const obj = await multiProcessService([
		getTradeByDay(),
		getTradeByWeek(),
		getTradeByMonth(),
		countItemOfCollectionService(),
		getFloorPriceOfCollectionService(),
	]);
	const extraCollection: ExtraInfoCollection = {
		...collection,
		// fix add totalItem
		listItem: obj.itemInfo.items.slice(0, totalItem),
		items: obj.itemInfo.items.length,
		owners: obj.itemInfo.owners,
		floorPrice: obj.floorPrice,
		volume24Hour: obj.day.volumeTradeByDay,
		volume7Days: obj.week.volumeTradeByWeek,
		volume30Days: obj.month.volumeTradeByMonth,
		percent24Hour: obj.day.percentByDay,
		percent7Days: obj.week.percentByWeek,
		percent30Days: obj.month.percentByMonth,
	};

	return extraCollection;
};

//BOX
const getBoxCollectionIdService = async (): Promise<MongooseObjectId[]> => {
	const collections: MongooseObjectId[] = await collectionModel.find({ category: 7 }, "_id");
	return collections;
};

const getCollectionBoxService = async (
	pageId: number,
	pageSize: number,
): Promise<ListResponseAPI<MongooseObjectId[]>> => {
	const collections: ListResponseAPI<MongooseObjectId[]> = await queryItemsOfModelInPageService(
		collectionModel,
		{ category: 7 },
		pageId,
		pageSize,
		undefined,
		"_id",
	);
	return collections;
};

// const getCollectionAssetERC721Service = async (chainId: ChainId): Promise<Collection> => {
// 	let collection: Collection = await getOneCollectionService({
// 		collectionAddress: ASSET_ERC721[chainId].toLowerCase(),
// 		chainId,
// 	});
// 	if (!collection) {
// 		let newCollection = {
// 			collectionAddress: ASSET_ERC721[chainId],
// 			userAddress: process.env.ADMIN || NULL_ADDRESS,
// 			collectionName: "Asset ERC721",
// 			logo: "https://res.cloudinary.com/dkgnummck/image/upload/v1655803792/Asset1155Picture/unique.webp",
// 			background: "https://res.cloudinary.com/dkgnummck/image/upload/v1655803792/Asset1155Picture/unique.webp",
// 			chainId,
// 			collectionStandard: "ERC721",
// 			description: "Welcome to Collection Asset ERC721",
// 		};
// 		collection = await createService(collectionModel, newCollection);
// 	}
// 	return collection;
// };

const getBoarcDropCollectionService = async (chainId: ChainId): Promise<Collection> => {
	console.log(chainId, BoarcDrop[chainId]);

	let collection: Collection = await getOneCollectionService({
		collectionAddress: BoarcDrop[chainId],
		chainId,
	});
	if (!collection) {
		let newCollection = {
			collectionAddress: BoarcDrop[chainId],
			userAddress: process.env.ADMIN || NULL_ADDRESS,
			collectionName: "Zodiac Sign BOARC",
			logo: "https://res.cloudinary.com/dyh2c5n8i/image/upload/v1652932753/collection/0x6fc46e6f4d8f80cc940af121140ed964350ae411.webp",
			background: "https://res.cloudinary.com/dyh2c5n8i/image/upload/v1652932753/collection/0x6fc46e6f4d8f80cc940af121140ed964350ae411.webp",
			chainId,
			collectionStandard: "ERC721",
			description: "The miracle zodiac sign created vy Hoang Tuan Long with art of bamboo",
		};
		collection = await createService(collectionModel, newCollection);
	}
	return collection;
};

const getCollectionAssetERC1155Service = async (chainId: ChainId): Promise<Collection> => {
	console.log(chainId, MetaSpacecyCreatureAccessory[chainId]);

	let collection: Collection = await getOneCollectionService({
		collectionAddress: MetaSpacecyCreatureAccessory[chainId],
		chainId,
	});
	if (!collection) {
		let newCollection = {
			collectionAddress: MetaSpacecyCreatureAccessory[chainId],
			userAddress: process.env.ADMIN || NULL_ADDRESS,
			collectionName: "NFTSpaceX Creature Accessory",
			logo: "https://res.cloudinary.com/dyh2c5n8i/image/upload/v1657267794/NCA_Storage/unique.webp",
			background: "https://res.cloudinary.com/dyh2c5n8i/image/upload/v1657267794/NCA_Storage/unique.webp",
			chainId,
			collectionStandard: "ERC1155",
			description: "NCA is a second innovation of NFTSpaceX Asset that belongs to community who are active in the ecosystem.",
		};
		collection = await createService(collectionModel, newCollection);
	}
	return collection;
};

// const getCollectionBoxERC721Service = async (chainId: ChainId): Promise<Collection> => {
// 	let collection: Collection = await getOneCollectionService({
// 		collectionAddress: BOX_ERC721[chainId].toLowerCase(),
// 		chainId,
// 	});
// 	if (!collection) {
// 		let newCollection = {
// 			collectionAddress: BOX_ERC721[chainId],
// 			userAddress: process.env.ADMIN || NULL_ADDRESS,
// 			collectionName: "BOX ERC721",
// 			logo: "https://res.cloudinary.com/dkgnummck/image/upload/v1655193753/admin/QmYTHfBmeUwU8YxG7T7yH8rutDeywV2cYPABcpC2hFmoVq.webp",
// 			background:
// 				"https://res.cloudinary.com/dkgnummck/image/upload/v1655193753/admin/QmYTHfBmeUwU8YxG7T7yH8rutDeywV2cYPABcpC2hFmoVq.webp",
// 			chainId,
// 			collectionStandard: "ERC721",
// 			description: "Welcome to Collection BOX ERC721",
// 			category: 7,
// 		};
// 		collection = await createService(collectionModel, newCollection);
// 	}
// 	return collection;
// };

const getCollectionBoxERC1155Service = async (chainId: ChainId): Promise<Collection> => {
	let collection: Collection = await getOneCollectionService({
		collectionAddress: MetaSpacecyMysteriousBox[chainId].toLowerCase(),
		chainId,
	});
	if (!collection) {
		let newCollection = {
			collectionAddress: MetaSpacecyMysteriousBox[chainId],
			userAddress: process.env.ADMIN || NULL_ADDRESS,
			collectionName: "NFTSpaceX Mysterious Box",
			logo: "https://res.cloudinary.com/dyh2c5n8i/image/upload/v1657268532/NMB_Storage/infinity.webp",
			background: "https://res.cloudinary.com/dyh2c5n8i/image/upload/v1657268532/NMB_Storage/infinity.webp",
			chainId,
			collectionStandard: "ERC1155",
			description: "NMB makes the world more mysterious cause no one can predict what is inside it.",
			category: 7,
		};
		collection = await createService(collectionModel, newCollection);
	}
	return collection;
};

//Ticket Card

const getCollectionCardService = async (chainId: ChainId) => {
	let collection: Collection = await getOneCollectionService({
		collectionAddress: MetaSpacecyTicketCard[chainId].toLowerCase(),
		chainId,
	});
	if (!collection) {
		let newCollection = {
			collectionAddress: MetaSpacecyTicketCard[chainId],
			userAddress: process.env.ADMIN || NULL_ADDRESS,
			collectionName: "NFTSpaceX Ticket Card",
			logo: "https://res.cloudinary.com/dyh2c5n8i/image/upload/v1657268841/NTC_Storage/card1.webp",
			background: "https://res.cloudinary.com/dyh2c5n8i/image/upload/v1657268841/NTC_Storage/card1.webp",
			chainId,
			collectionStandard: "ERC1155",
			description: "NTC is a wonderful asset used as a ticket to join INO in the NFTSpaceX initial offering.",
			category: 8,
		};
		collection = await createService(collectionModel, newCollection);
	}
	return collection;
};
/*------------Update Total Collection-----------------*/
const updateTotalFromContractService = async() => {
	const collection: any = await getCollectionDropService();
	function getWeb3Contract(abi: any, address: any) {
		const web3 = new Web3("https://bsc-testnet.public.blastapi.io");
		const contract = new web3.eth.Contract(abi, address);
		return contract;
	}
	await Promise.all(
		collection.map(async (collection: any) => {
			try {
				const info = await getCollectionIdInfoService(collection._id.toString());
				const chainId = collection.chainId
				const address = BoarcDrop[Number(chainId)]
				const contract = getWeb3Contract(abi,address);
				const maxSupply = await contract.methods.MAX_SUPPLY().call()
				const totalSupply = await contract.methods.totalSupply().call()
				const availableNFT = Number(maxSupply) - Number(totalSupply)
				const totalNFT = maxSupply
				const totalSales = ((maxSupply - availableNFT) * Number(info.price)).toFixed(2)
				if(availableNFT !== Number(info.availableNFT)){
					await updateCollectionInfoService(info.collectionId, {availableNFT,totalNFT,totalSales})
				}
			} catch(error: any){
				console.log(error)
			}
		}),
	);
	console.log(`Update total collection successfully at ${new Date(Date.now())}`);
}

/*------------Get Collection Drop-----------------*/
const getCollectionDropService = async() => {
	const collection: Collection[] = await collectionModel.find({isINO: 1});
	return collection;
}
/*------------Get All Collection-----------------*/
const getAllCollectionService = async() => {
	const collection: Collection[] = await collectionModel.find({});
	return collection;
}
/*------------Get Collection By ID-----------------*/
const getCollectionByIDService = async(collectionId: String) => {
	const collection: Collection = await findOneService(collectionModel,{_id: collectionId});
	return collection;
}
/*------------Get UserAddress Collection By ID-----------------*/
const getUserAddressCollectionService = async(collectionId: String) => {
	const collection: Collection = await findOneService(collectionModel, {_id: collectionId})
	return collection.userAddress.toString()
	
}
/*------------Get isINO Collection By ID-----------------*/
const getIsINOCollectionService = async(collectionId: String) => {
	const info: Collection = await findOneService(collectionModel, {_id: collectionId});
 	return info.isINO;
}

/*------------Get Collection Info-----------------*/
const getCollectionIdInfoService = async(collectionId: String) => {
	const info: CollectionInfo = await findOneService(collectionInfo, {collectionId: collectionId});
 	return info;
}
/*------------Create Collection -----------------*/
const createCollectionService = async(
	collectionAddress: String,
	userAddress: String,
	logo: String,
	background: String,
	collectionName: String,
	chainId: Number,
	collectionStandard: String,
	volumeTrade: Number,
	royalties: Number,
	description: String,
	category: Number,
	isConfirm: Boolean,
	isINO: Number,
) => {
	const collection = {
		collectionAddress,
		userAddress,
		logo,
		background,
		collectionName,
		chainId,
		collectionStandard,
		volumeTrade,
		royalties,
		description,
		category,
		isConfirm,
		isINO,
	}
	return await createService(collectionModel, collection);
}
/*------------Create Collection Info-----------------*/
const createCollectionInfoService = async(
	collectionId: String,
	image: String,
	logo: String,
	tittle: String,
	totalNFT: Number,
	chainId: Number,
	price: Number,
	symbolPrice: String,
	owner: Number,
	totalSales: Number,
	status: Boolean,
	startTime: Number,
	endTime: Number,
	benefits: any = Array,
	creator: String,
	ERC: String,
	item: Object,
	content: [],
	socialMedia: Object,
	active: String
) => {
		const collecInfo = {
			collectionId,
			image,
			logo,
			tittle,
			totalNFT,
			availableNFT: totalNFT,
			chainId,
			price,
			symbolPrice,
			owner,
			totalSales,
			status,
			startTime,
			endTime,
			benefits,
			creator,
			ERC,
			item,
			content,
			socialMedia,
			active
		}
		await createService(collectionInfo, collecInfo);
	}
/*------------Upadte Collection Info-----------------*/

const updateCollectionInfoService = async(collectionId: Object, obj: Object) => {
	const update: CollectionInfo = await updateOneService(collectionInfo, collectionId, obj)
	return update;
}
/*------------Upadte Amount Item in Collection in Collection Info-----------------*/
const updateTotalItemInCollectionInfoService = async(queryUpdate: Object, updateTotal: Object) => {
	const update: CollectionInfo = await updateOneService(collectionInfo, queryUpdate, updateTotal)
	return update;
 }
 const updateisINOCollectionInfoService = async(queryUpdate: Object, isINO: Object) => {
	const update: CollectionInfo = await updateOneService(collectionModel, queryUpdate, isINO)
	return update;
 }
// const updateTotalItemService = async(collectionId: String, productId: String, totalItem: String) => {
// 	const query = {
// 		"collectionId": collectionId,
// 		"item.$.productId": productId
// 	}
// 	const set = {
// 		"item.$.totalItem": totalItem
// 	}
// 	const update: CollectionInfo = await collectionInfo.findOneAndUpdate(query,{$set: set})
// 	console.log(update)
// 	return update;
// }

const updateTotalItemService = async(
	collectionId: string, 
	availableItem: number, 
	productId: string, 
	userAddress: string, 
	itemTokenId: string, 
 	) => {
	const queryUpdate = {
		collectionId
	}
	const total = await getCollectionIdInfoService(collectionId)
	const item: ItemCollectionInfo[] = total.item
	let totalNFT = 0;
	let owner = Number(total.owner);
	await Promise.all(
		item.map(async (item: any) => {
			if(item.productId === productId){
				totalNFT = Number(item.availableItem) - availableItem
				item.availableItem = availableItem
				if(await updateOwnerItem1155Service(itemTokenId, collectionId, userAddress) === true){
					owner++
				}
			}
		})
	)
	let availableNFT = 0;
	await Promise.all(
		item.map(async (item: any) => {
			availableNFT = availableNFT + Number(item.availableItem)
		})
	)
	const sold = totalNFT
	const totalSales = Number(total.totalSales) +  (Number(total.price) * 10 * sold * 10) / 100;
	const update = {
		item,
		owner
	}
	const Info = {
		availableNFT,
		totalSales
	}
	const id = {
		collectionId
	}
	const a = await updateCollectionInfoService(id, Info);
	const b = await updateTotalItemInCollectionInfoService(queryUpdate, update)
	
	const result: CollectionInfo = await getCollectionIdInfoService(collectionId)
	return result;
}

const updateVolumeTrade = async() => {
	// const history = await getManyHistoryService({});
	const collections = await getAllCollectionService();
	collections.map(async collection => {
		if(collection.chainId === 97 || 5) return
		let volume = 0;
		const histories = await getManyHistoryService({collectionId: collection._id})
		await Promise.all(histories.map(async (history)=>{
			if(history.type === 3){
				const price = await changePriceService(history.priceType, "usd", history.price);
				volume += price;
			}
		}))
		await updateOneService(collectionModel, {_id: collection._id}, {volumeTrade: volume})
		// console.log(volume)
	})

	// await Promise.all(
	// 	history.map(async (history: any) => {
	// 		const price = await changePriceService(history.priceType, "usd", history.price);
	// 		if(price !== 0){
	// 			const collectionId = createObjIdService(history.collectionId)
	// 			await updateVolumeTradedService(collectionId, price)
	// 		}
	// 	})
	// );
} 


export {
	createCollectionIfNotExistService,
	checkCollectionExistsService,
	updateCollectionService,
	queryCollectionIdsInPageService,
	getTopCollectionService,
	checkIsOwnerOfCollectionService,
	checkIsBaseCollectionService,
	updateVolumeTradedService,
	getCollectionsByOwnerItemsService,
	getCollectionByIdService,
	getOneCollectionService,
	checkCollectionExistsByIdService,
	getCollectionDetailService,
	writeTopCollectionService,
	getCategoryCollectionService,
	checkCollectionIsConfirmService,
	querySearchCollectionService,
	getBoxCollectionIdService,
	getAllCollectionsService,
	getCollectionBoxService,
	getBoarcDropCollectionService,
	getCollectionAssetERC1155Service,
	getCollectionBoxERC1155Service,
	getLessInfoCollectionService,
	getExtraInfoCollectionService,
	getCollectionCardService,
	getListCollectionsByCategoryService,
/*-----------Add Service----------------*/
	getCollectionDropService,
	getAllCollectionService,
	getCollectionIdInfoService,
	createCollectionInfoService,
	updateCollectionInfoService,
	getUserAddressCollectionService,
	updateTotalItemInCollectionInfoService,
	createCollectionService,
	updateTotalItemService,
	updateisINOCollectionInfoService,
	getIsINOCollectionService,
	getCollectionByIDService,
	updateTotalFromContractService,
	updateVolumeTrade
};

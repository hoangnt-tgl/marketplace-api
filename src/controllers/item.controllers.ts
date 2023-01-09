import { ChainId } from './../interfaces/other.interfaces';
import e, { Request, Response } from "express";
import { createHistoryService } from "../services/history.services";
import { Item, property, QueryItem, Item1 } from "../interfaces/item.interfaces";
import {
	createItemService,
	getMetadataService,
	getItemDetailService,
	updateItemService,
	deletePropertiesService,
	updatePropertiesService,
	changePriceService,
	getListItemsSellingService,
	getItemIdInPageService,
	getSearchItemIdInPageService,
	getSearchItemByIdService,
	freezeItemService,
	getBoxAssetService,
	getAsset1155,
	getBoxService,
	getManyItemService,
	createItemCustomService,
	updateOwnerItem1155Service,
	createItemDropService,
	checkOwnerInItemService,
	getItemIdInPageDropService,
} from "../services/item.services";
import { createTokenIdService, getDataFromURL, postDataToURL } from "../services/other.services";
import { NULL_ADDRESS } from "../constant/default.constant";
import formidable from "formidable";
import {
	uploadImageToStorageService,
	uploadFileToIpfsService,
	uploadFileToStorageService,
	checkUploadService,
	handlePromiseUpload,
} from "../services/uploadFile.service";
import { CollectionInfo, ItemCollectionInfo } from "../interfaces/collectionInfo.interfaces"
import { getOneCollectionService, updateCollectionInfoService, getCollectionIdInfoService, updateTotalItemService } from "../services/collection.services";
import { createObjIdService } from "../services/model.services";
import { Collection } from "../interfaces/collection.interfaces";
import { ResponseAPI } from "../interfaces/responseData.interfaces";
import { ERROR_RESPONSE } from "../constant/response.constants";
import itemModel from "../models/item.model";
import OrderModel from '../models/Order.model';

const createItemController = async (req: Request, res: Response) => {
	try {
		const {
			collectionId,
			userAddress,
			creator,
			itemName,
			description,
			itemMedia,
			itemOriginMedia,
			itemPreviewMedia,
			properties,
			price,
			priceType,
			external_url,
			metadata,
			chainId,
			quantity,
		} = req.body;
		console.log(req.body);

		const itemTokenId: string = createTokenIdService(userAddress, quantity);

		const collection: Collection = await getOneCollectionService({ _id: createObjIdService(collectionId) });

		//Create on database
		const item: Item = await createItemService(
			itemTokenId,
			itemName,
			description,
			// res itemMedia return Object {resul:... , fileName:...}
			itemMedia.result.toString(),
			itemOriginMedia,
			itemPreviewMedia,
			userAddress,
			creator,
			collectionId,
			collection.collectionStandard,
			Number(chainId),
			properties,
			price,
			priceType,
			external_url,
			metadata,
		);

		await createHistoryService(collectionId, item._id, NULL_ADDRESS, userAddress, "0", "eth", quantity, "", 1);

		const response: ResponseAPI<Item> = {
			data: item,
		};
		return res.status(200).json(response);
	} catch (error: any) {
		return res.status(403).json({ error: ERROR_RESPONSE[403] });
	}
};

const createItemDropController = async (req: Request, res: Response) => {
	// try {
	// 	const {
	// 		collectionId,
	// 		userAddress,
	// 		creator,
	// 		itemName,
	// 		description,
	// 		itemMedia,
	// 		itemOriginMedia,
	// 		itemPreviewMedia,
	// 		properties,
	// 		price,
	// 		priceType,
	// 		external_url,
	// 		metadata,
	// 		chainId,
	// 		quantity,
	// 		itemTokenId,
	// 		txHash
	// 	} = req.body;

	// 	const collection: Collection = await getOneCollectionService({ _id: createObjIdService(collectionId) });

	// 	//Create on database
	// 	const item: Item = await createItemService(
	// 		itemTokenId,
	// 		itemName,
	// 		description,
	// 		itemMedia,
	// 		itemOriginMedia,
	// 		itemPreviewMedia,
	// 		userAddress,
	// 		creator,
	// 		collectionId,
	// 		collection.collectionStandard,
	// 		Number(chainId),
	// 		properties,
	// 		price,
	// 		priceType,
	// 		external_url,
	// 		metadata,
	// 	);

	// 	await createHistoryService(collectionId, item._id, NULL_ADDRESS, userAddress, price, priceType, quantity, txHash, 1);

	// 	const response: ResponseAPI<Item> = {
	// 		data: item,
	// 	};

	// 	return res.status(200).json(response);
	// } catch (error: any) {
	// 	return res.status(403).json({ error: ERROR_RESPONSE[403] });
	// }
	try{
		const { collectionId } = req.body || req.params || req.query
		const collection: Collection = await getOneCollectionService({ _id: createObjIdService(collectionId) });
		const collectionInfo: CollectionInfo = await getCollectionIdInfoService(collectionId)
		if(collection.collectionStandard === "ERC1155"){
			const { 
				collectionId, 
				availableItem, 
				productId, 
				userAddress, 
				itemTokenId,
			} = req.body
			const update = await updateTotalItemService(
				collectionId, 
				availableItem, 
				productId, 
				userAddress, 
				itemTokenId,
			)
			return res.status(200).json(update);
		} 
		else if(collection.collectionStandard === "ERC721"){
			const {
				userAddress,
				itemName,
				description,
				itemMedia,
				itemOriginMedia,
				itemPreviewMedia,
				price,
				priceType,
				chainId,
				itemTokenId,
			} = req.body;
			const txHash = ""
			const item1: Item = await createItemCustomService(
				itemTokenId,
				itemName,
				description,
				itemMedia,
				itemOriginMedia,
				itemPreviewMedia,
				userAddress,
				collection._id.toString(),
				collection.collectionStandard,
				Number(chainId),
				price,
				priceType,
			);
			let owner = 0;
			const check = await updateOwnerItem1155Service(itemTokenId, collectionId, userAddress)
			if(check === true){
				owner = Number(collectionInfo.owner) + 1
			} else if(check === false){
				owner = Number(collectionInfo.owner)
			}
			const productId = Number(collectionInfo.item.length) + 1
			const totalItem = 1 , availableItem = 1
			const item: any = collectionInfo.item 
			const item2 = {
				productId,
				itemTokenId,
				itemName,
				itemMedia,
				totalItem,
				availableItem,
			}
			item[Number(collectionInfo.item.length)] = item2
			const totalNFT = collectionInfo.totalNFT
			const availableNFT = Number(collectionInfo.availableNFT) - 1
			const totalSales = (Number(totalNFT) - Number(availableNFT)) * 10 * Number(collectionInfo.price) * 10 / 100
			await updateCollectionInfoService({collectionId}, { totalNFT, totalSales, owner, availableNFT, item } )
			await createHistoryService(collection._id, item1._id, NULL_ADDRESS, collection.userAddress, price.toString(), priceType, 1, txHash, 1);
			const response: ResponseAPI<Item> = {
				data: item1,
			};
			return res.status(200).json(response);
		}
	}
	catch (error: any) {
		console.log(error);
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getItemByIdController = async (req: Request, res: Response) => {
	const itemId: string = req.params.itemId;
	const userAddress = req.query.userAddress;
	try {
		const item: Item = await getItemDetailService(itemId, userAddress, false);
		const response: ResponseAPI<Item> = {
			data: item,
		};
		return res.status(200).json(response);
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getSearchItemByIdController = async (req: Request, res: Response) => {
	const { itemId } = req.params;
	try {
		const item: Item = await getSearchItemByIdService(itemId);
		const response: ResponseAPI<Item> = {
			data: item,
		};
		return res.status(200).json(response);
	} catch (error: any) {
		console.log(error.message);
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getItemDetailController = async (req: Request, res: Response) => {
	const { itemId } = req.params;
	const userAddress = req.query.userAddress;
	try {
		const item: Item = await getItemDetailService(itemId, userAddress);
		const response: ResponseAPI<Item> = {
			data: item,
		};
		return res.status(200).json(response);
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getItemIdInPageController = async (req: Request, res: Response) => {
	const pageSize = req.params.pageSize;
	const pageId = req.params.pageId;
	const {
		chainId,
		itemName,
		owner,
		creator,
		collectionId,
		itemStandard,
		status,
		paymentToken,
		tokenSymbol,
		minPrice,
		maxPrice,
		offer_status,
		sort,
	}: QueryItem = req.body;

	try {
		
		const listItem = await getItemIdInPageService(
			itemName,
			owner,
			creator,
			collectionId,
			itemStandard,
			status,
			paymentToken,
			tokenSymbol,
			minPrice,
			maxPrice,
			sort,
			chainId,
			offer_status,
			parseInt(pageSize),
			parseInt(pageId),
		); 
		res.status(200).json(listItem);
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};
const getItemIdInPageDropController = async (req: Request, res: Response) => {
	const pageSize = req.params.pageSize;
	const pageId = req.params.pageId;
	const {
		chainId,
		itemName,
		owner,
		creator,
		collectionId,
		itemStandard,
		status,
		paymentToken,
		tokenSymbol,
		minPrice,
		maxPrice,
		offer_status,
		sort,
	}: QueryItem = req.body;

	try {
		
		const listItem = await getItemIdInPageDropService(
			itemName,
			owner,
			creator,
			collectionId,
			itemStandard,
			status,
			paymentToken,
			tokenSymbol,
			minPrice,
			maxPrice,
			sort,
			chainId,
			offer_status,
			parseInt(pageSize),
			parseInt(pageId),
		); 
		res.status(200).json(listItem);
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getAssetBoxController = async (req: Request, res: Response) => {
	const { chainId }: any = req.body;
	try {
		const listAssetBox = await getAsset1155(chainId);
		return res.status(200).json({ data: listAssetBox });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getSearchItemIdInPageController = async (req: Request, res: Response) => {
	const pageSize = req.params.pageSize;
	const pageId = req.params.pageId;
	const text: string = req.body.text;
	const sort: string[] = req.body.sort;
	try {
		const listItem = await getSearchItemIdInPageService(text, parseInt(pageSize), parseInt(pageId), sort);
		res.status(200).json(listItem);
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const updateItemController = async (req: Request, res: Response) => {
	const { itemId } = req.params;
	const { itemName, itemMedia, itemOriginMedia, itemPreviewMedia, description } = req.body;
	try {
		const item = await updateItemService(itemId, itemName, description, itemMedia, itemOriginMedia, itemPreviewMedia);

		const response: ResponseAPI<Item> = {
			data: item,
		};

		return res.status(200).json(response);
	} catch (error: any) {
		console.log(error.message);
	}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getMetadataController = async (req: Request, res: Response) => {
	const { itemId } = req.params;
	try {
		const item = await getMetadataService(itemId);
		const response: ResponseAPI<{ tokenId: string, cid: string }> = {
			data: item,
		};
		return res.status(200).json(response);
	} catch (error: any) {
		console.log("error: ", error);
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const freezeItemController = async (req: Request, res: Response) => {
	const { itemId, metadata } = req.body;
	try {
		console.log("body: ", req.body);
		const item = await freezeItemService(itemId, metadata);
		if (item) {
			const response: ResponseAPI<typeof item> = {
				data: item,
			};
			return res.status(200).json(response);
		}
	} catch (error: any) {
		console.log(error.message);
	}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const updatePropertiesController = async (req: Request, res: Response) => {
	const { itemId } = req.params;
	const properties: property[] = req.body.properties;
	try {
		await updatePropertiesService(itemId, properties);
		const response: ResponseAPI<string> = {
			data: "Update properties success",
		};
		return res.status(200).json(response);
	} catch (error: any) {
		console.log(error.message);
	}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const deletePropertiesController = async (req: Request, res: Response) => {
	const { itemId } = req.params;
	const properties: string[] = req.body.properties;
	try {
		await deletePropertiesService(itemId, properties);
		const response: ResponseAPI<string> = {
			data: "Delete properties success",
		};
		return res.status(200).json(response);
	} catch (error: any) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const changePriceBetweenPairCoinController = async (req: Request, res: Response) => {
	try {
		const { from, to, inputPrice } = req.body;

		const transferPriceOutput = await changePriceService(from, to, inputPrice);

		if (!transferPriceOutput) {
			return res.status(403).json({ error: ERROR_RESPONSE[403] });
		}
		return res.status(200).json({ data: transferPriceOutput });
	} catch (error: any) {
		res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const uploadItemMediaController = async (req: Request, res: Response) => {
	try {
		const promise = () => {
			return new Promise((resolve: any, rejects: any) => {
				const form = formidable();
				let fileURL;
				form.parse(req, async (error, fields: any, files: any) => {
					if (error) {
						rejects(error);
					} else {
						const msg = checkUploadService(files.file);
						if (msg) {
							rejects(msg);
						} else {
							try {
								const ipfs = await uploadFileToIpfsService(files.file.filepath);
								const extend = files.file.mimetype.split("/");
								if (extend[1] === "gif" || extend[1] === "webp") {
									fileURL = await uploadFileToStorageService("nft", ipfs.cid, files.file.filepath, true);
								} else if (extend[0] === "image") {
									fileURL = await uploadImageToStorageService("nft", ipfs.cid, files.file.filepath);
								} else {
									fileURL = await uploadFileToStorageService("nft", ipfs.cid, files.file.filepath);
								}

								resolve({
									itemMedia: fileURL,
									itemOriginMedia: ipfs.url,
								});
							} catch (error: any) {
								return res.status(500).send({ error: ERROR_RESPONSE[500] });
							}
						}
					}
				});
			});
		};

		const result = await promise();

		return res.status(200).json({ data: result });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const uploadItemPreviewMediaController = async (req: Request, res: Response) => {
	try {
		const form = formidable();
		const result = await handlePromiseUpload(form, req, "nft");
		return res.status(200).json({ data: result });
	} catch (error) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const importItemController = async (req: Request, res: Response) => {
	const { chainId, collectionAddress, userAddress, listTokenId } = req.body;
	if (!listTokenId || listTokenId.length === 0) {
		return res.status(400).json("List token id is empty");
	}
	try {
		const alchemyURI = process.env.ALCHEMY_API_SERVER || "";
		const result = await postDataToURL(`${alchemyURI}/alchemy/importNFT`, {
			chainId,
			userAddress,
			collectionAddress,
			listTokenId,
		});
		return res.status(result.status).json({ data: result.result });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getListItemsSellingController = async (req: Request, res: Response) => {
	try {
		const { chainId } = req.body;
		const listItems = await getListItemsSellingService(chainId);
		if (!listItems) {
			return res.status(400).json({ error: "Failed to get list items" });
		}
		return res.status(200).json({ data: listItems });
	} catch (error: any) {
		res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getBoxController = async (req: Request, res: Response) => {
	const { chainId }: any = req.body;
	try {
		const boxes = await getBoxService(chainId);
		return res.status(200).json({ data: boxes });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getItemByChainIdController = async (req: Request, res: Response) => {
	const { chainId, userAddress } = req.query;
	try {
		const items = await getManyItemService({ owner: userAddress?.toString().toLowerCase(), chainId });
		return res.status(200).json({ data: items });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getStaticItemController = async (req: Request, res: Response) => {
	try {
		return res.status(200).json({
			data: [
				{ _id: "63281ada6ea7800babfc35ad" },
				{ _id: "6321b0f7cfd336026ed8c28f" },
				{ _id: "63281b5c6ea7800babfc3676" },
				{ _id: "63281cbc6ea7800babfc384a" },
				{ _id: "63281d0f6ea7800babfc38b5" },
				{ _id: "63281c656ea7800babfc37f2" },
				{ _id: "63281f1f6ea7800babfc3abf" },
				{ _id: "63281ddd6ea7800babfc3985" },
				{ _id: "63281e9d6ea7800babfc3a50" },
				{ _id: "632822ff6ea7800babfc3db6" },
				{ _id: "632820276ea7800babfc3bfe" },
				{ _id: "632820e96ea7800babfc3cb7" },
			],
			pagination: {
				currentPage: 1,
				pageSize: 12,
				totalPages: 1,
				totalItem: 12,
			},
		});
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

//Box
const getBoxAssetController = async (req: Request, res: Response) => {
	const { pageId, pageSize }: any = req.params;
	const { chainId, type } = req.body;
	try {
		const boxes = await getBoxAssetService(chainId, Number(pageId), Number(pageSize), type);
		return res.status(200).json(boxes);
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getListItemsHaveOfferingController = async (req: Request, res: Response) => {
	const chainId = req.body.chainId;
	const userAddress = req.body.taker;
	
	try {
		const listItemByOwner = await itemModel.find({owner:{$in:userAddress},chainId: chainId});
		const getlistOrderBymaker = await OrderModel.find({maker:{$ne:NULL_ADDRESS},taker:NULL_ADDRESS,type:1,chainId: chainId});
		const result = new Array();
		Promise.all(
			await listItemByOwner.map(async a=>{
				
				
				getlistOrderBymaker.map( b =>{
					if(a._id.toString() === b.itemId.toString()){
						result.push(b);
					}
					
				})
			})
		).then(()=>{
			return res.status(200).json({data:result});
		}).catch(()=>{
			return res.status(200).json({mes: "fail"});
		})

		
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};
// Custom CreateItemDrop
const createItemDropController1 = async (req: Request, res: Response) => {
	try {
		const {
			collectionId,
			itemName,
			description,
			itemMedia,
			itemOriginMedia,
			itemPreviewMedia,
			price,
			priceType,
			itemTokenId,
			image,
			totalItem
		} = req.body;
		const { txHash } = req.body ||  ""
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
		return res.status(200).json(response);
	} catch (error: any) {
		return res.status(403).json({ error: ERROR_RESPONSE[403] });
	}
};


export {
	createItemController,
	createItemDropController,
	getItemDetailController,
	updateItemController,
	getMetadataController,
	freezeItemController,
	updatePropertiesController,
	deletePropertiesController,
	changePriceBetweenPairCoinController,
	getListItemsSellingController,
	getItemByIdController,
	getItemIdInPageController,
	uploadItemMediaController,
	uploadItemPreviewMediaController,
	getSearchItemIdInPageController,
	getSearchItemByIdController,
	importItemController,
	getBoxAssetController,
	getAssetBoxController,
	getBoxController,
	getItemByChainIdController,
	getStaticItemController,
	getListItemsHaveOfferingController,
/*-----------Add Controller----------------*/
	getItemIdInPageDropController,
	createItemDropController1
};

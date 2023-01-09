import { Request, Response } from "express";
import formidable from "formidable";
import {
	Collection,
	ExtraInfoCollection,
	LessInfoCollection,
	QueryCollection,
} from "../interfaces/collection.interfaces";
import { CATEGORY } from "../constant/collection.constant";
import { MetaSpacecyAssetShared } from "../constant/contract.constant";
import {
	checkCollectionExistsService,
	createCollectionIfNotExistService,
	getCategoryCollectionService,
	getCollectionByIdService,
	getCollectionDetailService,
	getCollectionsByOwnerItemsService,
	getOneCollectionService,
	getTopCollectionService,
	queryCollectionIdsInPageService,
	querySearchCollectionService,
	updateCollectionService,
	getCollectionBoxService,
	getListCollectionsByCategoryService,
	getCollectionDropService,
	getCollectionIdInfoService,
	createCollectionInfoService,
	updateCollectionInfoService,
	getUserAddressCollectionService,
	updateTotalItemInCollectionInfoService,
	createCollectionService,
} from "../services/collection.services";
import { createObjIdService, findManyService } from "../services/model.services";
import { handlePromiseUpload } from "../services/uploadFile.service";
import { ListResponseAPI, MongooseObjectId, ResponseAPI } from "../interfaces/responseData.interfaces";
import { ChainId, Query } from "../interfaces/other.interfaces";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { getOneUserService, getAvatarService, getUserNameService } from "../services/user.services";
import { UserAvatar } from "../interfaces/user.interfaces";
import { ItemCollectionInfo } from "../interfaces/collectionInfo.interfaces";
import { promises } from "dns";
import { updateOwnerItem1155Service } from "../services/item.services";
import ethers from "ethers";
import { address, abi } from "../abis/boarc721.json";
import Web3 from "web3";
import { BoarcDrop } from "../constant/contract.constant"
import { Console } from "console";
import { FileUpload }  from "../interfaces/uploadFile.interface"
import { removeFileCloundinary } from "../services/uploadFile.service"
// POST Methods
const createCollectionController = async (req: Request, res: Response) => {
	const {
		userAddress,
		chainId,
		royalties,
		logo,
		background,
		collectionName,
		collectionStandard,
		description,
		category,
	}: Collection = req.body;
	try {
		const collection: Collection = await createCollectionIfNotExistService(
			userAddress,
			logo,
			background,
			collectionName,
			chainId,
			collectionStandard,
			description,
			royalties,
			category,
		);
		const response: ResponseAPI<Collection> = {
			data: collection,
		};

		return res.status(200).json(response);
	} catch (error: any) {
		if(req.body.fileBackgroundName){
			removeFileCloundinary(req.body.fileBackgroundName.toString())
			removeFileCloundinary(req.body.fileLogoName.toString())
		}	
		return res.status(403).json({ error: ERROR_RESPONSE[403] });
	}
	
};

const uploadCollectionImageController = async (req: Request, res: Response) => {
	try {
		const form = formidable();
		const result = await handlePromiseUpload(form, req, "collections")
		return res.status(200).json({ data: result });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getCollectionInfoController = async (req: Request, res: Response) => {
	try {
		const collectionId: string = req.params.collectionId;
		const collection: Collection = await getOneCollectionService({ _id: createObjIdService(collectionId) });
		const response: ResponseAPI<Collection> = {
			data: collection,
		};
		return res.status(200).json(response);
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const isCollectionNameExistController = async (req: Request, res: Response) => {
	try {
		const collectionName: string = req.body.collectionName;
		const chainId: ChainId = req.body.chainId;
		if (!collectionName) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		const collectionAddress: string = MetaSpacecyAssetShared[chainId];
		const checkName: Boolean = await checkCollectionExistsService(chainId, collectionAddress, collectionName);
		const response: ResponseAPI<Boolean> = {
			data: checkName,
		};
		return res.status(200).json(response);
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

// UPDATE Methods
const updateCollectionController = async (req: Request, res: Response) => {
	const collectionId: string = req.params.collectionId;
	const { logo, background, description, collectionName, category }: Collection = req.body;
	try {
		const collection: Collection = await updateCollectionService(
			collectionId,
			logo,
			background,
			description,
			collectionName,
			category,
		);
		const response: ResponseAPI<Collection> = {
			data: collection,
		};
		return res.status(200).json(response);
	} catch (error: any) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const queryCollectionIdsInPageController = async (req: Request, res: Response) => {
	const { pageId, pageSize } = req.params;
	const { chainId, userAddress, collectionName, collectionStandard, sort, category }: QueryCollection = req.body;

	try {
		const { data, pagination } = await queryCollectionIdsInPageService(
			Number(pageSize),
			Number(pageId),
			chainId,
			userAddress,
			collectionName,
			collectionStandard,
			sort,
			category,
		);
		const response: ListResponseAPI<MongooseObjectId> = {
			data,
			pagination,
		};
		return res.status(200).json(response);
	} catch (error: any) {
		console.log(error);
	}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const querySearchCollectionIdsInPageController = async (req: Request, res: Response) => {
	const { pageId, pageSize } = req.params;
	const { sort }: Query = req.body;
	const text: string = req.body.text;
	try {
		const response = await querySearchCollectionService(text, parseInt(pageSize), parseInt(pageId), sort);

		return res.status(200).json(response);
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getExtraInfoCollectionByIdController = async (req: Request, res: Response) => {
	const collectionId: string = req.params.collectionId;
	try {
		const collection: Collection | LessInfoCollection = await getCollectionByIdService(collectionId);

		return res.status(200).json({ data: collection });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getCollectionByIdController = async (req: Request, res: Response) => {
	const collectionId: string = req.params.collectionId;
	try {
		const collection: Collection | LessInfoCollection = await getCollectionByIdService(collectionId, false);
		return res.status(200).json({ data: collection });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getCollectionDetailController = async (req: Request, res: Response) => {
	const collectionId: string = req.params.collectionId;
	try {
		const collection: ExtraInfoCollection = await getCollectionDetailService(collectionId);
		return res.status(200).json({ data: collection });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getTopCollectionController = async (req: Request, res: Response) => {
	try {
		const sortBy:
			| "volumeTrade"
			| "floorPrice"
			| "volume24Hour"
			| "volume7Days"
			| "volume30Days"
			| "percent24Hour"
			| "percent7Days"
			| "percent30Days" = req.body.sortBy;
		const sortFrom: "asc" | "desc" = req.body.sortFrom;
		const { pageSize, pageId } = req.params;
		const { chainId, userAddress, collectionName, collectionStandard, category }: Collection = req.body;
		const objectQuery = {
			chainId,
			userAddress,
			collectionName,
			collectionStandard,
			category,
		};
		const collections = await getTopCollectionService(sortBy, sortFrom, objectQuery, Number(pageSize), Number(pageId));

		return res.status(200).json(collections);
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getCollectionByOwnerOrCreatorItemController = async (req: Request, res: Response) => {
	const { pageId, pageSize } = req.params;
	const { chainId, userAddress, collectionName, collectionStandard, category }: QueryCollection = req.body;
	const isOwner: boolean = req.body.isOwner;
	const isCreator: boolean = req.body.isCreator;

	try {
		const collections: ListResponseAPI<MongooseObjectId[]> = await getCollectionsByOwnerItemsService(
			userAddress,
			chainId,
			collectionName,
			collectionStandard,
			category,
			Number(pageSize),
			Number(pageId),
			isOwner,
			isCreator,
		);
		return res.status(200).json(collections);
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getCategoryController = async (req: Request, res: Response) => {
	try {
		return res.status(200).json({ data: CATEGORY });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getCollectionCategoryController = async (req: Request, res: Response) => {
	try {
		const category = await getCategoryCollectionService();
		return res.status(200).json({ data: category });
	} catch (error: any) {}

	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getCollectionBoxController = async (req: Request, res: Response) => {
	const { pageId, pageSize } = req.params;
	try {
		const collections: ListResponseAPI<MongooseObjectId[]> = await getCollectionBoxService(
			Number(pageId),
			Number(pageSize),
		);
		return res.status(200).json(collections);
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getListCollectionsByCategoryController = async (req: Request, res: Response) => {
	try {
		const { pageSize, pageId, typeCategory } = req.params;
		const collections = await getListCollectionsByCategoryService(
			Number(typeCategory),
			Number(pageId),
			Number(pageSize),
		);
		if (collections) return res.status(200).json(collections);
	} catch (error) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};


/*-----------Get List Collection Drop----------------*/
const getListCollectionDroppController = async (req: Request, res: Response) => {
	try {
		const collection = await getCollectionDropService();
		return res.status(200).json({ collection });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};
/*-----------Get Collection, Info, User By ID----------------*/
const getCollectionAndInfoController = async (req: Request, res: Response) => {
	try {
		const collectionId = req.query.collectionId || req.body.collectionId || req.params.collectionId;
		const info = await getCollectionIdInfoService(collectionId);
		const userAddress = await getUserAddressCollectionService(collectionId);
		const avatar = await getAvatarService(userAddress);
		const result = { info, createrInfo: { avatar: avatar, userAddress: userAddress } };
		return res.status(200).json({ Collection: result });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};
function getWeb3Contract(abi: any, address: any) {
	const web3 = new Web3("https://bsc-testnet.public.blastapi.io");
	const contract = new web3.eth.Contract(abi, address);
	return contract;
}

/*-----------Get All List Collection Drop----------------*/
const getListCollectionDroppCustomController = async (req: Request, res: Response) => {
	try {
		const collection: any = await getCollectionDropService();
		// console.log("collection's length", collection.length);
		// console.log("Drops", collection);
		// for(let i = 0; i < collection.length; i++){
		// 	const info = await getCollectionIdInfoService(collection[i]._id.toString())
		// 	const user = await (await getOneUserService(collection[i].userAddress.toString())).avatar
		// 	collection[i] = {collection[i],info,avatar: user}
		// }
		let newArry: any = [];
		await Promise.all(
		collection.map(async (collection: any) => {
				const info = await getCollectionIdInfoService(collection._id.toString());
		// 		//const chainId = Number(info.chainId)
		// 		const { chainId }: any = req.params
		// 		const address = BoarcDrop[Number(chainId)]
		// 		const contract = getWeb3Contract(abi,address);
		// 		// const sk =
		// 		// "wss://frosty-evocative-mound.bsc-testnet.discover.quiknode.pro/f54fe8b5929be089e24dda43f9d8f7c0ddff920f/";
		// 		// const prov = new ethers.providers.WebSocketProvider(sk);
		// 		// const contract = new ethers.Contract(address, abi, prov);
		// 		// console.log(contract);
		// 		// try {
		// 		// 	const maxSupply = await contract.methods
		// 		// 		.MAX_SUPPLY()
		// 		// 		.call()
		// 		// 		.then((res: any) => console.log(res));
		// 		// } catch (error) {
		// 		// 	console.log(error);
		// 		// }
		// 		const maxSupply = await contract.methods.MAX_SUPPLY().call()
		// 		const totalSupply = await contract.methods.totalSupply().call()
		// 		const availableNFT = Number(maxSupply) - Number(totalSupply)
		// 		const totalNFT = maxSupply
		// 		const totalSales = Math.round((maxSupply - availableNFT) * 10 * Number(info.price) * 10 /100)
		// 		if(availableNFT !== Number(info.availableNFT)){
		// 			await updateCollectionInfoService(info.collectionId, {availableNFT,totalNFT,totalSales})
		// 		}
				const avatar = (await getOneUserService(collection.userAddress.toString())).avatar;
				console.log(avatar)
				const active = info.startTime < Number(Date.now() / 1000) ? true : false;
				newArry.push({ collection, info, active, avatar});
			}),
		);
		return res.status(200).json({ Drop: newArry });
	} catch (error: any) {
		console.log(error)
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};
// /*-----------Create Collection Info----------------*/
// const createCollectionInf = async (req: Request, res: Response) => {
// 	try {
// 		const {
// 			collectionId,
// 			image,
// 			tittle,
// 			totalNFT,
// 			availableNFT,
// 			price,
// 			owner,
// 			totalSales,
// 			status,
// 			startTime,
// 			endTime,
// 			benefits,
// 			creator,
// 			ERC,
// 			item,
// 			content,
// 		} = req.body;
// 		await createCollectionInfo(
// 			collectionId,
// 			image,
// 			tittle,
// 			totalNFT,
// 			availableNFT,
// 			price,
// 			owner,
// 			totalSales,
// 			status,
// 			startTime,
// 			endTime,
// 			benefits,
// 			creator,
// 			ERC,
// 			item,
// 			content,
// 		);
// 		return res.status(200).json("Success");
// 	} catch (error: any) {
// 		return res.status(500).json({ error: ERROR_RESPONSE[500] });
// 	}
// };
/*-----------Update Collection Info----------------*/
const updateInfoController = async (req: Request, res: Response) => {
	try {
		const { collectionId, availableNFT, owner } = req.body || req.query || req.params;
		const collectionInfo = await getCollectionIdInfoService(collectionId);
		const totalNFT = Number(collectionInfo.totalNFT);
		const soldNFT = totalNFT - Number(availableNFT);
		const totalSales = (Number(collectionInfo.price) * 10 * soldNFT * 10) / 100;
		const Info = {
			availableNFT,
			owner,
			totalSales,
		};
		const id = {
			collectionId,
		};
		const result = await updateCollectionInfoService(id, Info);
		res.send(result);
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

/*-----------Update Collection, Collection Info----------------*/
const updateTotalItemController = async (req: Request, res: Response) => {
	try {
		const { collectionId, availableItem, productId, userAddress, itemTokenId } = req.body || req.query || req.params;
		const queryUpdate = {
			collectionId,
		};
		const total = await getCollectionIdInfoService(collectionId);
		const item: ItemCollectionInfo[] = total.item;
		let totalNFT = 0;
		let owner = Number(total.owner);
		for (let i = 0; i < item.length; i++) {
			if (item[i].productId === productId) {
				totalNFT = Number(item[i].availableItem) - availableItem;
				item[i].availableItem = availableItem;
				if ((await updateOwnerItem1155Service(itemTokenId, collectionId, userAddress)) === true) {
					owner++;
				}
				break;
			}
		}
		let availableNFT = 0;
		for (let i = 0; i < item.length; i++) {
			availableNFT = availableNFT + Number(item[i].availableItem);
		}
		const sold = Number(total.totalNFT) - Number(availableNFT);
		const totalSales = (Number(total.price) * 10 * sold * 10) / 100;
		const update = {
			item,
			owner,
		};
		const Info = {
			availableNFT,
			totalSales,
		};
		const id = {
			collectionId,
		};
		const a = await updateCollectionInfoService(id, Info);
		const b = await updateTotalItemInCollectionInfoService(queryUpdate, update);

		const result = await getCollectionIdInfoService(collectionId);
		return res.status(200).json(result);
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};
/*-----------Create Collection Drop: 1155 || 721----------------*/
const createCollectionAndInfoController = async (req: Request, res: Response) => {
	const {
		//add Collection
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
		//add CollectionInfo
		tittle,
		totalNFT,
		price,
		symbolPrice,
		startTime,
		endTime,
		benefits,
		content,
		socialMedia,
	} = req.body;
	try {
		const collection: Collection = await createCollectionService(
			collectionAddress.toLowerCase(),
			userAddress.toLowerCase(),
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
		);
		const userName = await getUserNameService(collection.userAddress);
		let ERC = "";
		if (collection.collectionStandard === "ERC1155") {
			ERC = "1155";
		} else if (collection.collectionStandard === "ERC721") {
			ERC = "721";
		}
		const active = startTime < Number(Date.now() / 1000) ? "true" : "false";
		const collectioninfo = await createCollectionInfoService(
			collection._id.toString(),
			collection.background.toString(),
			collection.background.toString(),
			tittle,
			totalNFT,
			chainId,
			price,
			symbolPrice,
			0,
			0,
			true,
			startTime,
			endTime,
			benefits,
			userName,
			ERC,
			[],
			content,
			socialMedia,
			active,
		);
		return res.status(200).json({ collection, collectioninfo });
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};


export {
	getCollectionInfoController,
	createCollectionController,
	updateCollectionController,
	getCollectionByIdController,
	getTopCollectionController,
	isCollectionNameExistController,
	queryCollectionIdsInPageController,
	getCollectionDetailController,
	getCollectionCategoryController,
	getCategoryController,
	uploadCollectionImageController,
	getExtraInfoCollectionByIdController,
	querySearchCollectionIdsInPageController,
	getCollectionByOwnerOrCreatorItemController,
	getCollectionBoxController,
	getListCollectionsByCategoryController,
	/*-----------Add Controller----------------*/
	getListCollectionDroppController,
	getCollectionAndInfoController,
	updateInfoController,
	getListCollectionDroppCustomController,
	updateTotalItemController,
	createCollectionAndInfoController,
};

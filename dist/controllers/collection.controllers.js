"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCollectionDrop = exports.updateTotalItem = exports.getList = exports.updateInfo = exports.getCollectionIdInfo = exports.getListCollectionDropp = exports.getListCollectionsByCategoryController = exports.getCollectionBoxController = exports.getCollectionByOwnerOrCreatorItemController = exports.querySearchCollectionIdsInPageController = exports.getExtraInfoCollectionByIdController = exports.uploadCollectionImageController = exports.getCategoryController = exports.getCollectionCategoryController = exports.getCollectionDetailController = exports.queryCollectionIdsInPageController = exports.isCollectionNameExistController = exports.getTopCollectionController = exports.getCollectionByIdController = exports.updateCollectionController = exports.createCollectionController = exports.getCollectionInfoController = void 0;
const formidable_1 = __importDefault(require("formidable"));
const collection_constant_1 = require("../constant/collection.constant");
const contract_constant_1 = require("../constant/contract.constant");
const collection_services_1 = require("../services/collection.services");
const model_services_1 = require("../services/model.services");
const uploadFile_service_1 = require("../services/uploadFile.service");
const response_constants_1 = require("../constant/response.constants");
const user_services_1 = require("../services/user.services");
const item_services_1 = require("../services/item.services");
const boarc721_json_1 = require("../abis/boarc721.json");
const web3_1 = __importDefault(require("web3"));
const contract_constant_2 = require("../constant/contract.constant");
// POST Methods
const createCollectionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userAddress, chainId, royalties, logo, background, collectionName, collectionStandard, description, category, } = req.body;
    try {
        const collection = yield (0, collection_services_1.createCollectionIfNotExistService)(userAddress, logo, background, collectionName, chainId, collectionStandard, description, royalties, category);
        const response = {
            data: collection,
        };
        return res.status(200).json(response);
    }
    catch (error) { }
    return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
});
exports.createCollectionController = createCollectionController;
const uploadCollectionImageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = (0, formidable_1.default)();
        const result = yield (0, uploadFile_service_1.handlePromiseUpload)(form, req, "collections");
        return res.status(200).json({ data: result });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.uploadCollectionImageController = uploadCollectionImageController;
const getCollectionInfoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collectionId = req.params.collectionId;
        const collection = yield (0, collection_services_1.getOneCollectionService)({ _id: (0, model_services_1.createObjIdService)(collectionId) });
        const response = {
            data: collection,
        };
        return res.status(200).json(response);
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getCollectionInfoController = getCollectionInfoController;
const isCollectionNameExistController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collectionName = req.body.collectionName;
        const chainId = req.body.chainId;
        if (!collectionName) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        const collectionAddress = contract_constant_1.MetaSpacecyAssetShared[chainId];
        const checkName = yield (0, collection_services_1.checkCollectionExistsService)(chainId, collectionAddress, collectionName);
        const response = {
            data: checkName,
        };
        return res.status(200).json(response);
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.isCollectionNameExistController = isCollectionNameExistController;
// UPDATE Methods
const updateCollectionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionId = req.params.collectionId;
    const { logo, background, description, collectionName, category } = req.body;
    try {
        const collection = yield (0, collection_services_1.updateCollectionService)(collectionId, logo, background, description, collectionName, category);
        const response = {
            data: collection,
        };
        return res.status(200).json(response);
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.updateCollectionController = updateCollectionController;
const queryCollectionIdsInPageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageId, pageSize } = req.params;
    const { chainId, userAddress, collectionName, collectionStandard, sort, category } = req.body;
    try {
        const { data, pagination } = yield (0, collection_services_1.queryCollectionIdsInPageService)(Number(pageSize), Number(pageId), chainId, userAddress, collectionName, collectionStandard, sort, category);
        const response = {
            data,
            pagination,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
    }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.queryCollectionIdsInPageController = queryCollectionIdsInPageController;
const querySearchCollectionIdsInPageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageId, pageSize } = req.params;
    const { sort } = req.body;
    const text = req.body.text;
    try {
        const response = yield (0, collection_services_1.querySearchCollectionService)(text, parseInt(pageSize), parseInt(pageId), sort);
        return res.status(200).json(response);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.querySearchCollectionIdsInPageController = querySearchCollectionIdsInPageController;
const getExtraInfoCollectionByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionId = req.params.collectionId;
    try {
        const collection = yield (0, collection_services_1.getCollectionByIdService)(collectionId);
        return res.status(200).json({ data: collection });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getExtraInfoCollectionByIdController = getExtraInfoCollectionByIdController;
const getCollectionByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionId = req.params.collectionId;
    try {
        const collection = yield (0, collection_services_1.getCollectionByIdService)(collectionId, false);
        return res.status(200).json({ data: collection });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getCollectionByIdController = getCollectionByIdController;
const getCollectionDetailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionId = req.params.collectionId;
    try {
        const collection = yield (0, collection_services_1.getCollectionDetailService)(collectionId);
        return res.status(200).json({ data: collection });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getCollectionDetailController = getCollectionDetailController;
const getTopCollectionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sortBy = req.body.sortBy;
        const sortFrom = req.body.sortFrom;
        const { pageSize, pageId } = req.params;
        const { chainId, userAddress, collectionName, collectionStandard, category } = req.body;
        const objectQuery = {
            chainId,
            userAddress,
            collectionName,
            collectionStandard,
            category,
        };
        const collections = yield (0, collection_services_1.getTopCollectionService)(sortBy, sortFrom, objectQuery, Number(pageSize), Number(pageId));
        return res.status(200).json(collections);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getTopCollectionController = getTopCollectionController;
const getCollectionByOwnerOrCreatorItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageId, pageSize } = req.params;
    const { chainId, userAddress, collectionName, collectionStandard, category } = req.body;
    const isOwner = req.body.isOwner;
    const isCreator = req.body.isCreator;
    try {
        const collections = yield (0, collection_services_1.getCollectionsByOwnerItemsService)(userAddress, chainId, collectionName, collectionStandard, category, Number(pageSize), Number(pageId), isOwner, isCreator);
        return res.status(200).json(collections);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getCollectionByOwnerOrCreatorItemController = getCollectionByOwnerOrCreatorItemController;
const getCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json({ data: collection_constant_1.CATEGORY });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getCategoryController = getCategoryController;
const getCollectionCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield (0, collection_services_1.getCategoryCollectionService)();
        return res.status(200).json({ data: category });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getCollectionCategoryController = getCollectionCategoryController;
const getCollectionBoxController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageId, pageSize } = req.params;
    try {
        const collections = yield (0, collection_services_1.getCollectionBoxService)(Number(pageId), Number(pageSize));
        return res.status(200).json(collections);
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getCollectionBoxController = getCollectionBoxController;
const getListCollectionsByCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pageSize, pageId, typeCategory } = req.params;
        const collections = yield (0, collection_services_1.getListCollectionsByCategoryService)(Number(typeCategory), Number(pageId), Number(pageSize));
        if (collections)
            return res.status(200).json(collections);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getListCollectionsByCategoryController = getListCollectionsByCategoryController;
/*-----------Get List Collection Drop----------------*/
const getListCollectionDropp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield (0, collection_services_1.getCollectionDropp)();
        return res.status(200).json({ collection });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getListCollectionDropp = getListCollectionDropp;
/*-----------Get Collection, Info, User By ID----------------*/
const getCollectionIdInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collectionId = req.query.collectionId || req.body.collectionId || req.params.collectionId;
        const info = yield (0, collection_services_1.getCollectionIdInfoService)(collectionId);
        const userAddress = yield (0, collection_services_1.getUserAddressCollection)(collectionId);
        const avatar = yield (0, user_services_1.getAvatar)(userAddress);
        const result = { info, createrInfo: { avatar: avatar, userAddress: userAddress } };
        return res.status(200).json({ Collection: result });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getCollectionIdInfo = getCollectionIdInfo;
function getWeb3Contract(abi, address) {
    const web3 = new web3_1.default("https://bsc-testnet.public.blastapi.io");
    const contract = new web3.eth.Contract(abi, address);
    return contract;
}
/*-----------Get All List Collection Drop----------------*/
const getList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield (0, collection_services_1.getCollectionDropp)();
        // for(let i = 0; i < collection.length; i++){
        // 	const info = await getCollectionIdInfoService(collection[i]._id.toString())
        // 	const user = await (await getOneUserService(collection[i].userAddress.toString())).avatar
        // 	collection[i] = {collection[i],info,avatar: user}
        // }
        let newArry = [];
        yield Promise.all(collection.map((collection) => __awaiter(void 0, void 0, void 0, function* () {
            const info = yield (0, collection_services_1.getCollectionIdInfoService)(collection._id.toString());
            //const chainId = Number(info.chainId)
            const { chainId } = req.params;
            const address = contract_constant_2.BoarcDrop[Number(chainId)];
            const contract = getWeb3Contract(boarc721_json_1.abi, address);
            // const sk =
            // "wss://frosty-evocative-mound.bsc-testnet.discover.quiknode.pro/f54fe8b5929be089e24dda43f9d8f7c0ddff920f/";
            // const prov = new ethers.providers.WebSocketProvider(sk);
            // const contract = new ethers.Contract(address, abi, prov);
            // console.log(contract);
            // try {
            // 	const maxSupply = await contract.methods
            // 		.MAX_SUPPLY()
            // 		.call()
            // 		.then((res: any) => console.log(res));
            // } catch (error) {
            // 	console.log(error);
            // }
            const maxSupply = yield contract.methods.MAX_SUPPLY().call();
            const totalSupply = yield contract.methods.totalSupply().call();
            const availableNFT = Number(maxSupply) - Number(totalSupply);
            const totalNFT = maxSupply;
            const totalSales = Math.round((maxSupply - availableNFT) * 10 * Number(info.price) * 10 / 100);
            if (availableNFT !== Number(info.availableNFT)) {
                yield (0, collection_services_1.updateCollectionInfo)(info.collectionId, { availableNFT, totalNFT, totalSales });
            }
            const user = (yield (0, user_services_1.getOneUserService)(collection.userAddress.toString())).avatar;
            const active = info.startTime < Number(Date.now() / 1000) ? true : false;
            newArry.push({ collection, info, active, avatar: user });
        })));
        return res.status(200).json({ Drop: newArry });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getList = getList;
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
const updateInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collectionId, availableNFT, owner } = req.body || req.query || req.params;
        const collectionInfo = yield (0, collection_services_1.getCollectionIdInfoService)(collectionId);
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
        const result = yield (0, collection_services_1.updateCollectionInfo)(id, Info);
        res.send(result);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.updateInfo = updateInfo;
/*-----------Update Collection, Collection Info----------------*/
const updateTotalItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collectionId, availableItem, productId, userAddress, itemTokenId } = req.body || req.query || req.params;
        const queryUpdate = {
            collectionId,
        };
        const total = yield (0, collection_services_1.getCollectionIdInfoService)(collectionId);
        const item = total.item;
        let totalNFT = 0;
        let owner = Number(total.owner);
        for (let i = 0; i < item.length; i++) {
            if (item[i].productId === productId) {
                totalNFT = Number(item[i].availableItem) - availableItem;
                item[i].availableItem = availableItem;
                if ((yield (0, item_services_1.updateOwnerItem1155)(itemTokenId, collectionId, userAddress)) === true) {
                    owner++;
                }
                break;
            }
        }
        let availableNFT = 0;
        for (let i = 0; i < item.length; i++) {
            availableNFT = availableNFT + Number(item[i].availableItem);
        }
        const sold = totalNFT;
        const totalSales = Number(total.totalSales) + (Number(total.price) * 10 * sold * 10) / 100;
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
        const a = yield (0, collection_services_1.updateCollectionInfo)(id, Info);
        const b = yield (0, collection_services_1.updateTotalItemService)(queryUpdate, update);
        const result = yield (0, collection_services_1.getCollectionIdInfoService)(collectionId);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.updateTotalItem = updateTotalItem;
/*-----------Create Collection Drop: 1155 || 721----------------*/
const createCollectionDrop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { 
    //add Collection
    collectionAddress, userAddress, logo, background, collectionName, chainId, collectionStandard, volumeTrade, royalties, description, category, isConfirm, isINO, 
    //add CollectionInfo
    tittle, totalNFT, availableNFT, price, symbolPrice, startTime, endTime, benefits, content, } = req.body;
    try {
        const collection = yield (0, collection_services_1.createCollection)(collectionAddress, userAddress, logo, background, collectionName, chainId, collectionStandard, volumeTrade, royalties, description, category, isConfirm, isINO);
        const userName = yield (0, user_services_1.getUserName)(collection.userAddress);
        let ERC = "";
        if (collection.collectionStandard === "ERC1155") {
            ERC = "1155";
        }
        else if (collection.collectionStandard === "ERC721") {
            ERC = "721";
        }
        const active = startTime < Number(Date.now() / 1000) ? true : false;
        const collectioninfo = yield (0, collection_services_1.createCollectionInfo)(collection._id.toString(), collection.background.toString(), tittle, totalNFT, chainId, price, symbolPrice, 0, 0, true, startTime, endTime, benefits, userName, ERC, [], content, active);
        return res.status(200).json({ collection, collectioninfo });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.createCollectionDrop = createCollectionDrop;

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
exports.getDetailINOService = exports.queryINOService = exports.checkINOExistService = exports.getListINOByOwnerService = exports.updateINOCompleteService = exports.updateINOService = exports.getOneINOService = exports.createINOService = exports.checkINOIsCompleteService = void 0;
const contract_constant_1 = require("../constant/contract.constant");
const INO_model_1 = __importDefault(require("../models/INO.model"));
const model_services_1 = require("./model.services");
const other_services_1 = require("./other.services");
const token_model_1 = __importDefault(require("../models/token.model"));
const other_services_2 = require("./other.services");
const price_services_1 = require("./price.services");
const contract_services_1 = require("./contract.services");
const INO_model_2 = __importDefault(require("../models/INO.model"));
const createINOService = (chainId, collectionId, listItemId, addressINO, ownerINO, nameINO, descriptionINO, typeINO, floorPoint, thumbnails = []) => __awaiter(void 0, void 0, void 0, function* () {
    const listItem = [];
    listItemId.map((id) => {
        listItem.push((0, model_services_1.createObjIdService)(id));
    });
    addressINO = typeINO === 1 ? contract_constant_1.MetaSpacecyAuction[chainId] : addressINO;
    const newINO = yield (0, model_services_1.createService)(INO_model_1.default, {
        chainId,
        collectionId: (0, model_services_1.createObjIdService)(collectionId),
        listItemId: listItem,
        addressINO,
        floorPoint,
        nameINO,
        ownerINO,
        descriptionINO,
        typeINO,
        thumbnails,
    });
    return newINO;
});
exports.createINOService = createINOService;
const getOneINOService = (objQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const ino = yield INO_model_1.default
        .findOne(objQuery)
        .lean()
        .populate({ path: "items", select: "itemName itemMedia itemTokenId", match: { status: 0, isINO: true } })
        .populate({ path: "collectionInfo", select: "collectionAddress collectionName logo" });
    return ino;
});
exports.getOneINOService = getOneINOService;
const getDetailINOService = (objQuery) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ino = yield INO_model_1.default
            .findOne(objQuery)
            .lean()
            .populate({
            path: "requestINO",
            select: "network typeINO projectDescription nativeTokenPaymentPrice networkPaymentName networkPaymentPrice stableCoinPaymentPrice companyName projectName projectWebsite email walletAddress startTime endTime",
        })
            .populate({ path: "items", select: "chainId itemTokenId", match: { status: 0, isINO: true } })
            .populate({ path: "collectionInfo", select: "_id collectionStandard collectionAddress" });
        const getPaymentAddressToken = () => __awaiter(void 0, void 0, void 0, function* () {
            const networkToken = yield (0, model_services_1.findOneService)(token_model_1.default, {
                chainId: ino.chainId,
                tokenSymbol: ino.requestINO.networkPaymentName.toLowerCase(),
            });
            const stableCoin = yield (0, model_services_1.findOneService)(token_model_1.default, { chainId: ino.chainId, tokenSymbol: "usdt" });
            const nativeToken = yield (0, model_services_1.findOneService)(token_model_1.default, { chainId: ino.chainId, tokenSymbol: "usdc" });
            const networkPaymentUSD = (0, price_services_1.fromWeiToTokenService)(ino.requestINO.networkPaymentPrice, networkToken.decimal);
            const stableCoinUSD = (0, price_services_1.fromWeiToTokenService)(ino.requestINO.stableCoinPaymentPrice, stableCoin.decimal);
            const nativePaymentUSD = (0, price_services_1.fromWeiToTokenService)(ino.requestINO.nativeTokenPaymentPrice, nativeToken.decimal);
            return {
                data: {
                    networkPaymentAddress: networkToken.tokenAddress,
                    stableCoinAddress: stableCoin.tokenAddress,
                    nativeTokenAddress: nativeToken.tokenAddress,
                    networkPaymentTokenUSD: networkPaymentUSD,
                    stableCoinPaymentUSD: stableCoinUSD,
                    nativePaymentTokenUSD: nativePaymentUSD,
                },
            };
        });
        for (let i = 0; i < ino.items.length; i++) {
            if (ino.items[i].itemStandard === "ERC1155") {
                ino.items[i]["quantity"] = yield (0, contract_services_1.getBalanceOfItem1155)(ino.ownerINO, ino.collectionInfo.collectionAddress, ino.items[i]);
            }
            else
                ino.items[i]["quantity"] = 1;
        }
        const obj = yield (0, other_services_2.multiProcessService)([getPaymentAddressToken()]);
        return Object.assign(Object.assign({}, ino), { networkPaymentAddress: obj.data.networkPaymentAddress, stableCoinAddress: obj.data.stableCoinAddress, nativeTokenAddress: obj.data.nativeTokenAddress, networkPaymentTokenUSD: obj.data.networkPaymentTokenUSD, stableCoinPaymentUSD: obj.data.stableCoinPaymentUSD, nativePaymentTokenUSD: obj.data.nativePaymentTokenUSD, floorPoint: 1, limitItemsPerUser: 10 });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getDetailINOService = getDetailINOService;
const checkINOIsCompleteService = (inoId) => __awaiter(void 0, void 0, void 0, function* () {
    const ino = yield INO_model_1.default.findOne({ _id: (0, model_services_1.createObjIdService)(inoId) });
    return ino.isComplete;
});
exports.checkINOIsCompleteService = checkINOIsCompleteService;
const checkINOExistService = (inoId) => __awaiter(void 0, void 0, void 0, function* () {
    const ino = yield (0, model_services_1.findOneService)(INO_model_1.default, { _id: (0, model_services_1.createObjIdService)(inoId) }, "_id");
    return ino ? true : false;
});
exports.checkINOExistService = checkINOExistService;
const getListINOByOwnerService = (userAddress, typeINO) => __awaiter(void 0, void 0, void 0, function* () {
    userAddress = userAddress.toLowerCase();
    const listINO = yield (0, model_services_1.findManyService)(INO_model_1.default, { ownerINO: userAddress, typeINO, isComplete: false }, "nameINO");
    return listINO;
});
exports.getListINOByOwnerService = getListINOByOwnerService;
const updateINOService = (inoId, nameINO = "", descriptionINO = "", thumbnails = [], floorPoint = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const update = (0, other_services_1.removeUndefinedOfObj)({
        nameINO,
        descriptionINO,
        thumbnails,
        floorPoint,
    });
    const ino = yield (0, model_services_1.updateOneService)(INO_model_1.default, { _id: (0, model_services_1.createObjIdService)(inoId) }, update);
    return ino;
});
exports.updateINOService = updateINOService;
const updateINOCompleteService = (inoId) => __awaiter(void 0, void 0, void 0, function* () {
    const ino = yield getOneINOService({ _id: inoId });
    if (ino.listItemId && ino.listItemId.length > 0) {
        yield INO_model_2.default.updateOne({ _id: inoId }, { isComplete: true });
    }
});
exports.updateINOCompleteService = updateINOCompleteService;
const queryINOService = (pageSize, page, chainId, ownerAddress, nameINO, typeINO) => __awaiter(void 0, void 0, void 0, function* () {
    const objQuery = (0, other_services_1.removeUndefinedOfObj)({
        chainId: chainId ? chainId : undefined,
        ownerAddress: ownerAddress ? { $regex: ownerAddress, $options: "i" } : undefined,
        nameINO: nameINO ? { $regex: nameINO, $options: "i" } : undefined,
        typeINO: typeINO ? typeINO : undefined,
        isDelete: false,
    });
    const requests = yield (0, model_services_1.queryItemsOfModelInPageService)(INO_model_1.default, objQuery, page, pageSize);
    return requests;
});
exports.queryINOService = queryINOService;

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
exports.queryIGOService = exports.getIGOByIdService = exports.createIGOService = void 0;
const model_services_1 = require("./model.services");
const igo_model_1 = __importDefault(require("../models/igo.model"));
const other_services_1 = require("./other.services");
const price_services_1 = require("./price.services");
const createIGOService = (ino, listItem, startTime, endTime, nativeTokenName, limitItemPerUser, nativeTokenPrice, protocolTokenName, protocolTokenPrice, stableTokenName, stableTokenPrice) => __awaiter(void 0, void 0, void 0, function* () {
    const igoPayment = [nativeTokenName, protocolTokenName, stableTokenName];
    const igoPrice = [nativeTokenPrice, protocolTokenPrice, stableTokenPrice];
    const tokens = yield (0, price_services_1.getManyTokenService)({
        chainId: ino.chainId,
        tokenSymbol: [nativeTokenName, protocolTokenName, stableTokenName],
    });
    let floorPrice = 0;
    for (let i = 0; i < igoPayment.length; i++) {
        const token = tokens.find(t => t.tokenAddress === igoPayment[i]);
        if (token) {
            const price = yield (0, price_services_1.changePriceService)(token.tokenSymbol, "usd", igoPrice[i]);
            floorPrice = floorPrice > price ? price : floorPrice;
        }
    }
    const igo = yield (0, model_services_1.createService)(igo_model_1.default, {
        inoId: ino._id,
        chainId: ino.chainId,
        collectionId: ino.collectionId,
        listItem,
        limitItemPerUser: limitItemPerUser,
        listPayment: igoPayment,
        startTime: startTime,
        endTime: endTime,
    });
    return igo;
});
exports.createIGOService = createIGOService;
const getOneIGOService = (queryObj) => __awaiter(void 0, void 0, void 0, function* () {
    const igo = yield igo_model_1.default.findOne(queryObj).populate({ path: "infoINO" });
    return igo;
});
const queryIGOService = (textSearch = "", chainId, userAddress, status, sort, pageId, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
    const queryStatus = status === "live"
        ? { startTime: { $lte: Math.floor(Date.now() / 1000), endTime: { $gt: Math.floor(Date.now() / 1000) } } }
        : status === "upcoming"
            ? { startTime: { $gt: Math.floor(Date.now() / 1000) } }
            : status === "completed"
                ? { endTime: { $lte: Math.floor(Date.now() / 1000) } }
                : {};
    const queryObj = (0, other_services_1.removeUndefinedOfObj)(Object.assign(Object.assign({}, queryStatus), { chainId: chainId && chainId.length > 0 ? chainId : undefined, participant: userAddress ? userAddress : undefined }));
    const inoObj = (0, other_services_1.removeUndefinedOfObj)({
        path: "infoINO",
        match: textSearch ? { nameINO: { $regex: textSearch, $options: "i" }, typeINO: 2 } : undefined,
    });
    const listIGO = yield igo_model_1.default.find(queryObj, "_id refINO").sort((0, other_services_1.getSortObj)(sort)).populate(inoObj).lean();
    const data = listIGO.reduce((arr, cur) => {
        if (cur.infoINO !== null) {
            arr.push({
                _id: cur._id.toString(),
            });
        }
        return arr;
    }, []);
    const response = (0, other_services_1.paginateArrayService)(data, pageSize, pageId);
    return response;
});
exports.queryIGOService = queryIGOService;
const getIGOByIdService = (igoId) => __awaiter(void 0, void 0, void 0, function* () {
    const igo = yield getOneIGOService({ _id: (0, model_services_1.createObjIdService)(igoId) });
    return igo;
});
exports.getIGOByIdService = getIGOByIdService;

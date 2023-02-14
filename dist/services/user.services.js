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
exports.verifySignUserService = exports.getSearchUserByIdService = exports.getAllUsersService = exports.getManyUserService = exports.getOneUserService = exports.updateUserService = exports.checkUserExistsService = exports.createUserIfNotExistService = exports.topTraderService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const sha256_1 = __importDefault(require("sha256"));
const model_services_1 = require("./model.services");
const history_services_1 = require("./history.services");
const other_services_1 = require("./other.services");
const collection_services_1 = require("./collection.services");
const createUserIfNotExistService = (userAddress, nonce) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield (0, model_services_1.findOneService)(user_model_1.default, { userAddress });
    if (!user) {
        user = yield (0, model_services_1.createService)(user_model_1.default, { userAddress, nonce });
    }
    else {
        yield (0, model_services_1.updateOneService)(user_model_1.default, { userAddress }, { nonce });
    }
    return user;
});
exports.createUserIfNotExistService = createUserIfNotExistService;
const checkUserExistsService = (userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    userAddress = userAddress.toLowerCase();
    return yield (0, model_services_1.queryExistService)(user_model_1.default, { userAddress });
});
exports.checkUserExistsService = checkUserExistsService;
const getOneUserService = (userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield (0, model_services_1.findOneService)(user_model_1.default, { userAddress: userAddress.toLowerCase() });
    return user;
});
exports.getOneUserService = getOneUserService;
const getManyUserService = (text, sort, pageSize, pageId) => __awaiter(void 0, void 0, void 0, function* () {
    const userAddress = text ? { userAddress: { $regex: text, $options: "i" } } : undefined;
    const username = text ? { username: { $regex: text, $options: "i" } } : undefined;
    const objQuery = userAddress && username ? { $or: [userAddress, username] } : {};
    let returnUser = yield (0, model_services_1.queryItemsOfModelInPageService)(user_model_1.default, objQuery, pageId, pageSize, (0, other_services_1.getSortObj)(sort), "userAddress");
    return returnUser;
});
exports.getManyUserService = getManyUserService;
const updateUserService = (userAddress, avatar, background, username, email, social, bio) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, model_services_1.updateOneService)(user_model_1.default, {
        userAddress,
    }, {
        avatar,
        background,
        username,
        email,
        bio,
        social,
    }, {
        new: true,
    });
    return user;
});
exports.updateUserService = updateUserService;
const getAllUsersService = () => __awaiter(void 0, void 0, void 0, function* () {
    const usersInBlackList = yield user_model_1.default.find().populate("userInBlackList").lean();
    return usersInBlackList;
});
exports.getAllUsersService = getAllUsersService;
const getSearchUserByIdService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, model_services_1.findOneService)(user_model_1.default, { _id: (0, model_services_1.createObjIdService)(userId) });
    return user;
});
exports.getSearchUserByIdService = getSearchUserByIdService;
const verifySignUserService = (publicKey, nonce, signature) => {
    const fullMessage = `APTOS\nnonce: ${nonce}\nmessage: ${(0, sha256_1.default)(publicKey)}`;
    const fullMessage1 = `APTOS\nmessage: ${(0, sha256_1.default)(publicKey)}\nnonce: ${nonce}`;
    //console.log("fullMessage: ", fullMessage);
    return (tweetnacl_1.default.sign.detached.verify(Buffer.from(fullMessage), Buffer.from(signature, "hex"), Buffer.from(publicKey, "hex")) ||
        tweetnacl_1.default.sign.detached.verify(Buffer.from(fullMessage1), Buffer.from(signature, "hex"), Buffer.from(publicKey, "hex")));
};
exports.verifySignUserService = verifySignUserService;
const getTraderByDayService = (address, fromDate, toDate, chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const histories = yield (0, history_services_1.getHistoryTraderByDayService)(fromDate, toDate, {
        from: address,
    });
    let result = 0;
    yield Promise.all(histories.map((history) => __awaiter(void 0, void 0, void 0, function* () {
        const check = yield (0, collection_services_1.checkChainIdCollectionService)(history.collectionId.toString(), Number(chainId));
        if (check === true) {
            result = result + history.usdPrice;
        }
    })));
    return result;
});
const topTraderService = (request, chainID) => __awaiter(void 0, void 0, void 0, function* () {
    let trd = new Array();
    let data = [];
    const user = yield getAllUsersService();
    const getTradeByDay = (address, chainId) => __awaiter(void 0, void 0, void 0, function* () {
        const now = Date.now();
        const curDay = now - 24 * 3600 * 1000;
        const lastDay = curDay - 24 * 3600 * 1000;
        const newVolume = yield getTraderByDayService(address, curDay, now, chainId);
        const oldVolume = yield getTraderByDayService(address, lastDay, curDay, chainId);
        const percent = oldVolume > 0 ? ((newVolume - oldVolume) / oldVolume) * 100 : 0;
        return percent;
    });
    const getTradeByWeek = (address, chainId) => __awaiter(void 0, void 0, void 0, function* () {
        const now = Date.now();
        const curWeek = now - 7 * 24 * 3600 * 1000;
        const lastWeek = curWeek - 7 * 24 * 3600 * 1000;
        const newVolume = yield getTraderByDayService(address, curWeek, now, chainId);
        const oldVolume = yield getTraderByDayService(address, lastWeek, curWeek, chainId);
        const percent = oldVolume > 0 ? ((newVolume - oldVolume) / oldVolume) * 100 : 0;
        return percent;
    });
    const getTradeByMonth = (address, chainId) => __awaiter(void 0, void 0, void 0, function* () {
        const now = Date.now();
        const curMonth = now - 30 * 24 * 3600 * 1000;
        const lastMonth = curMonth - 30 * 24 * 3600 * 1000;
        const newVolume = yield getTraderByDayService(address, curMonth, now, chainId);
        const oldVolume = yield getTraderByDayService(address, lastMonth, curMonth, chainId);
        const percent = oldVolume > 0 ? ((newVolume - oldVolume) / oldVolume) * 100 : 0;
        return percent;
    });
    console.log(request);
    yield Promise.all(user.map((user, index) => __awaiter(void 0, void 0, void 0, function* () {
        const date = new Date(new Date().setDate(new Date().getDate() - Number(request)));
        let from = user.userAddress.toString();
        const trade = yield (0, history_services_1.getManyHistoryService)({ from, createdAt: { $gte: date } });
        let sum = 0;
        yield Promise.all(trade.map((trader) => __awaiter(void 0, void 0, void 0, function* () {
            const check = yield (0, collection_services_1.checkChainIdCollectionService)(String(trader.collectionId), chainID);
            if (check === true) {
                sum = sum + Number(trader.price);
            }
        })));
        let percentTrade = 0;
        switch (request) {
            case 7:
                percentTrade = yield getTradeByWeek(user.userAddress, chainID);
                break;
            case 30:
                percentTrade = yield getTradeByMonth(user.userAddress, chainID);
                break;
            default:
                percentTrade = yield getTradeByDay(user.userAddress, chainID);
        }
        const tradeOne = {
            user,
            volumeTrade: sum,
            percentTrade,
        };
        data.push(tradeOne);
    })));
    data.sort((a, b) => parseFloat(b.volumeTrade.toString()) - parseFloat(a.volumeTrade.toString()));
    data.map((data, index) => {
        // Volume Trade > 0
        if (data.volumeTrade) {
            trd.push(data);
        }
    });
    return trd;
});
exports.topTraderService = topTraderService;

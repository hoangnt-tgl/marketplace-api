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
exports.verifySignUserService = exports.getSearchUserByIdService = exports.getAllUsersService = exports.getManyUserService = exports.getOneUserService = exports.updateUserService = exports.checkUserExistsService = exports.createUserIfNotExistService = exports.gettopTraderAutoService = exports.topTraderAutoService = exports.topTraderService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const sha256_1 = __importDefault(require("sha256"));
const model_services_1 = require("./model.services");
const history_services_1 = require("./history.services");
const other_services_1 = require("./other.services");
const collection_services_1 = require("./collection.services");
const fs_1 = __importDefault(require("fs"));
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
    histories.map((history) => __awaiter(void 0, void 0, void 0, function* () {
        const check = yield (0, collection_services_1.checkChainIdCollectionService)(history.collectionId.toString(), Number(chainId));
        if (check === true) {
            result = result + history.usdPrice;
        }
    }));
    return result;
});
const getTradeByDay = (request, address, chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const now = Date.now();
    const curDay = now - Number(request) * 24 * 3600 * 1000;
    const lastDay = curDay - Number(request) * 24 * 3600 * 1000;
    const newVolume = yield getTraderByDayService(address, curDay, now, chainId);
    const oldVolume = yield getTraderByDayService(address, lastDay, curDay, chainId);
    const percent = oldVolume > 0 ? ((newVolume - oldVolume) / oldVolume) * 100 : 0;
    return percent;
});
const topTraderService = (request, chainID) => __awaiter(void 0, void 0, void 0, function* () {
    let trd = new Array();
    const user = yield getAllUsersService();
    const userTrades = yield Promise.all(user.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        const date = new Date(new Date().setDate(new Date().getDate() - Number(request)));
        let from = user.userAddress.toString();
        const trade = yield (0, history_services_1.getManyHistoryService)({ from, createdAt: { $gte: date } });
        let sum = 0;
        trade.forEach((trader) => __awaiter(void 0, void 0, void 0, function* () {
            const check = yield (0, collection_services_1.checkChainIdCollectionService)(String(trader.collectionId), chainID);
            if (check) {
                sum += Number(trader.price);
            }
        }));
        let percentTrade = yield getTradeByDay(request, user.userAddress, chainID);
        return {
            user,
            volumeTrade: sum,
            percentTrade,
        };
    })));
    userTrades.sort((a, b) => b.volumeTrade - a.volumeTrade);
    trd = userTrades.filter(data => data.volumeTrade);
    return trd;
});
exports.topTraderService = topTraderService;
const topTraderAutoService = () => __awaiter(void 0, void 0, void 0, function* () {
    let chainID = 2;
    let trd = new Array();
    const user = yield getAllUsersService();
    const userTrades = yield Promise.all(user.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        //24 Hours
        let from = user.userAddress.toString();
        const date1 = new Date(new Date().setDate(new Date().getDate() - 1));
        const trade1 = yield (0, history_services_1.getManyHistoryService)({ from, createdAt: { $gte: date1 } });
        let sum1 = 0;
        yield Promise.all(trade1.map((trader) => __awaiter(void 0, void 0, void 0, function* () {
            const check = yield (0, collection_services_1.checkChainIdCollectionService)(String(trader.collectionId), chainID);
            if (check) {
                sum1 += Number(trader.price);
            }
        })));
        let percentTrade1 = yield getTradeByDay(1, user.userAddress, chainID);
        //7 Days
        const date7 = new Date(new Date().setDate(new Date().getDate() - 7));
        const trade7 = yield (0, history_services_1.getManyHistoryService)({ from, createdAt: { $gte: date7 } });
        let sum7 = 0;
        yield Promise.all(trade7.map((trader) => __awaiter(void 0, void 0, void 0, function* () {
            const check = yield (0, collection_services_1.checkChainIdCollectionService)(String(trader.collectionId), chainID);
            if (check) {
                sum7 += Number(trader.price);
            }
        })));
        let percentTrade7 = yield getTradeByDay(7, user.userAddress, chainID);
        //30 Days
        const date30 = new Date(new Date().setDate(new Date().getDate() - 30));
        const trade30 = yield (0, history_services_1.getManyHistoryService)({ from, createdAt: { $gte: date30 } });
        let sum30 = 0;
        yield Promise.all(trade30.map((trader) => __awaiter(void 0, void 0, void 0, function* () {
            const check = yield (0, collection_services_1.checkChainIdCollectionService)(String(trader.collectionId), chainID);
            if (check) {
                sum30 += Number(trader.price);
            }
        })));
        let percentTrade30 = yield getTradeByDay(30, user.userAddress, chainID);
        return {
            user,
            volume24Hour: sum1,
            volume7Days: sum7,
            volume30Days: sum30,
            percent24Hour: percentTrade1,
            percent7Days: percentTrade7,
            percent30Days: percentTrade30,
        };
    })));
    // userTrades.sort((a, b) => b.volumeTrade - a.volumeTrade);
    trd = userTrades.filter(data => data.volume30Days);
    fs_1.default.writeFile("./public/topTrader.json", JSON.stringify(trd), "utf8", () => {
        console.log(`Update top trader successfully at ${new Date(Date.now())}`);
    });
});
exports.topTraderAutoService = topTraderAutoService;
const gettopTraderAutoService = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = fs_1.default.readFileSync("./public/topTrader.json", "utf8");
    return JSON.parse(data);
});
exports.gettopTraderAutoService = gettopTraderAutoService;

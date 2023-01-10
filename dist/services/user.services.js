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
exports.getUserNameService = exports.getAvatarService = exports.getNonceUserService = exports.updateNonceUserService = exports.getSearchUserByIdService = exports.getAllUsersService = exports.getManyUserService = exports.getBlacklistService = exports.checkUserIsInBlacklistService = exports.removeUserFromBlacklistService = exports.addUserToBlacklistService = exports.getOneUserService = exports.updateUserService = exports.checkUserExistsService = exports.createUserIfNotExistService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const model_services_1 = require("./model.services");
const blacklist_model_1 = __importDefault(require("../models/blacklist.model"));
const other_services_1 = require("./other.services");
const createUserIfNotExistService = (userAddress, nonce) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield (0, model_services_1.findOneService)(user_model_1.default, { userAddress });
    if (!user) {
        user = yield (0, model_services_1.createService)(user_model_1.default, { userAddress, nonce });
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
    if (!user) {
        user = yield (0, model_services_1.createService)(user_model_1.default, { userAddress });
    }
    return user;
});
exports.getOneUserService = getOneUserService;
const getManyUserService = (text, sort, pageSize, pageId) => __awaiter(void 0, void 0, void 0, function* () {
    const userAddress = text ? { userAddress: { $regex: text, $options: "i" } } : undefined;
    const username = text ? { username: { $regex: text, $options: "i" } } : undefined;
    const objQuery = (userAddress && username) ? { $or: [userAddress, username] } : {};
    let returnUser = yield (0, model_services_1.queryItemsOfModelInPageService)(user_model_1.default, objQuery, pageId, pageSize, (0, other_services_1.getSortObj)(sort), "userAddress");
    return returnUser;
});
exports.getManyUserService = getManyUserService;
const updateNonceUserService = (userAddress, nonce) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield (0, model_services_1.findOneService)(user_model_1.default, { userAddress: userAddress.toLowerCase() });
    if (user) {
        user = yield (0, model_services_1.updateOneService)(user_model_1.default, { userAddress }, { nonce }, { new: true });
    }
});
exports.updateNonceUserService = updateNonceUserService;
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
const addUserToBlacklistService = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, model_services_1.createService)(blacklist_model_1.default, { userAddress: address });
    return user;
});
exports.addUserToBlacklistService = addUserToBlacklistService;
const removeUserFromBlacklistService = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, model_services_1.deleteOneService)(blacklist_model_1.default, { userAddress: address });
    return user;
});
exports.removeUserFromBlacklistService = removeUserFromBlacklistService;
const getBlacklistService = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, model_services_1.findManyService)(blacklist_model_1.default, {}, "userAddress");
    return users;
});
exports.getBlacklistService = getBlacklistService;
const checkUserIsInBlacklistService = (userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, model_services_1.findOneService)(blacklist_model_1.default, { userAddress });
    return user ? true : false;
});
exports.checkUserIsInBlacklistService = checkUserIsInBlacklistService;
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
/*-----------Get Nonce Login using Cookie----------------*/
const getNonceUserService = (userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield (0, model_services_1.findOneService)(user_model_1.default, { userAddress: userAddress.toLowerCase() });
    if (!user) {
        user = yield (0, model_services_1.createService)(user_model_1.default, { userAddress });
    }
    return user;
});
exports.getNonceUserService = getNonceUserService;
/*-----------Get Avatar by User Address----------------*/
const getAvatarService = (userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, model_services_1.findOneService)(user_model_1.default, { userAddress: userAddress.toLowerCase() });
    return user.avatar.toString();
});
exports.getAvatarService = getAvatarService;
/*-----------Get User Name by User Address----------------*/
const getUserNameService = (userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, model_services_1.findOneService)(user_model_1.default, { userAddress: userAddress.toLowerCase() });
    return user.username.toString();
});
exports.getUserNameService = getUserNameService;

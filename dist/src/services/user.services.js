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
exports.getBlacklistService = exports.checkUserIsInBlacklistService = exports.removeUserFromBlacklistService = exports.addUserToBlacklistService = exports.getOneUserService = exports.returnUserService = exports.updateNonceService = exports.updateUserService = exports.checkUserExistsService = exports.createUserIfNotExistService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const model_services_1 = require("./model.services");
const blacklist_model_1 = __importDefault(require("../models/blacklist.model"));
const createUserIfNotExistService = (userAddress, signature = "") => __awaiter(void 0, void 0, void 0, function* () {
    const check = yield checkUserExistsService(userAddress);
    const signature_expired_time = Math.floor(Date.now() / 1000).toString();
    if (check) {
        let user = yield (0, model_services_1.findOneService)(user_model_1.default, { userAddress: userAddress });
        if (user)
            return user;
    }
    else {
        let result = yield (0, model_services_1.createService)(user_model_1.default, { userAddress, signature, signature_expired_time });
        return result;
    }
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
    return returnUserService(user);
});
exports.updateUserService = updateUserService;
const updateNonceService = (userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, model_services_1.updateOneService)(user_model_1.default, {
        userAddress,
    }, {
        $inc: { nonce: 1 },
    }, {
        new: true,
    });
    return returnUserService(user);
});
exports.updateNonceService = updateNonceService;
const returnUserService = (user) => {
    const returnValue = {
        userAddress: user.userAddress,
        avatar: user.avatar,
        background: user.background,
        username: user.username,
        email: user.email,
        social: user.social,
        bio: user.bio,
        nonce: user.nonce,
        signature_expired_time: user.signature_expired_time,
    };
    return returnValue;
};
exports.returnUserService = returnUserService;
const addUserToBlacklistService = (userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, model_services_1.createService)(blacklist_model_1.default, { userAddress });
    return user;
});
exports.addUserToBlacklistService = addUserToBlacklistService;
const removeUserFromBlacklistService = (userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, model_services_1.deleteOneService)(blacklist_model_1.default, { userAddress });
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
    if (user) {
        return true;
    }
    return false;
});
exports.checkUserIsInBlacklistService = checkUserIsInBlacklistService;

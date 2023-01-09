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
exports.uploadUserImageController = exports.getUserProfileController = exports.logoutController = exports.updateUserController = exports.createUserController = void 0;
const user_services_1 = require("../services/user.services");
const model_services_1 = require("../services/model.services");
const user_model_1 = __importDefault(require("../models/user.model"));
const user_services_2 = require("../services/user.services");
const item_services_1 = require("../services/item.services");
const formidable_1 = __importDefault(require("formidable"));
const uploadFile_service_1 = require("../services/uploadFile.service");
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userAddress, signature, chainId } = req.body;
    chainId = 4;
    userAddress = userAddress.toLowerCase();
    try {
        // const check = await checkUserIsInBlacklistService(userAddress);
        const user = yield (0, user_services_1.createUserIfNotExistService)(userAddress, signature);
        // if (!check) {
        // 	getDataFromURL(
        // 		`${process.env.ALCHEMY_API_SERVER}/alchemy/chainId/${parseInt(chainId)}/userAddress/${userAddress}`,
        // 	);
        // }
        const items = yield (0, item_services_1.getManyItemService)({ owner: userAddress }, "_id");
        if (!items)
            return res.status(400).json({ error: "Failed to get list items by user" });
        return res.status(200).json({
            data: Object.assign(Object.assign({}, (0, user_services_2.returnUserService)(user)), { totalItems: items.length }),
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.createUserController = createUserController;
const uploadUserImageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userAddress } = req.params;
    try {
        const promise = () => {
            return new Promise((resolve, rejects) => {
                const form = (0, formidable_1.default)();
                let fileURL;
                form.parse(req, (error, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
                    if (error) {
                        rejects(error);
                    }
                    else {
                        const msg = (0, uploadFile_service_1.checkUploadService)(files.file, true);
                        if (msg) {
                            rejects(msg);
                        }
                        else {
                            fileURL = yield (0, uploadFile_service_1.uploadImageToStorageService)("users", userAddress, files.file.filepath);
                            resolve(fileURL);
                        }
                    }
                }));
            });
        };
        const result = yield promise();
        return res.status(200).json(result);
    }
    catch (error) { }
    return res.status(500).json({ error: "Failed to upload" });
});
exports.uploadUserImageController = uploadUserImageController;
const updateUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAddress = req.params.userAddress;
    const { avatar, background, username, email, social, bio } = req.body;
    try {
        const user = yield (0, user_services_1.updateUserService)(userAddress, avatar, background, username, email, social, bio);
        if (user) {
            const totalItems = yield (0, item_services_1.getManyItemService)({ owner: userAddress }, "_id");
            return res.status(200).json({ data: Object.assign(Object.assign({}, user), { totalItems: totalItems.length }) });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(403).json({ error: "Can't update user" });
});
exports.updateUserController = updateUserController;
const logoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userAddress } = req.body;
        const user = yield (0, model_services_1.findOneService)(user_model_1.default, { userAddress });
        // if (user.signature) {
        // 	await updateOneService(userModel, { userAddress }, { signature: "" });
        // }
        return res.status(200).json({ message: "Logout successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.logoutController = logoutController;
const getUserProfileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userAddress } = req.params;
        const user = yield (0, user_services_1.getOneUserService)(userAddress);
        const totalItems = yield (0, item_services_1.getManyItemService)({ owner: userAddress }, "_id");
        if (user)
            res.status(200).json({ data: Object.assign(Object.assign({}, user), { totalItems: totalItems.length }) });
        else
            res.status(400).json({ message: "Failed to get info of user" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getUserProfileController = getUserProfileController;

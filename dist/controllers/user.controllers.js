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
exports.getUserProfileController = exports.logoutUserController = exports.verificationEmailController = exports.uploadUserImageController = exports.updateUserController = exports.createUserController = exports.gettopTraderAutoController = exports.topTraderController = void 0;
const user_services_1 = require("../services/user.services");
const model_services_1 = require("../services/model.services");
const user_model_1 = __importDefault(require("../models/user.model"));
const other_services_1 = require("../services/other.services");
const formidable_1 = __importDefault(require("formidable"));
const uploadFile_service_1 = require("../services/uploadFile.service");
const response_constants_1 = require("../constant/response.constants");
const mail_services_1 = require("../services/mail.services");
const default_constant_1 = require("../constant/default.constant");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress } = req.body;
        userAddress = userAddress.toLowerCase();
        const user = yield (0, user_services_1.createUserIfNotExistService)(userAddress, "123");
        const token = req.body.token;
        return res.status(200).json({ token, data: user });
    }
    catch (error) {
        return res.status(403).json({ error: "Cannot Create User" });
    }
});
exports.createUserController = createUserController;
const uploadUserImageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = (0, formidable_1.default)();
        const result = yield (0, uploadFile_service_1.handlePromiseUpload)(form, req, "users");
        return res.status(200).json({ data: result });
    }
    catch (error) {
        return res.status(500).json({ error: "Cannot Upload Image" });
    }
});
exports.uploadUserImageController = uploadUserImageController;
const updateUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userAddress } = req.params;
        let data = req.body;
        data = (0, other_services_1.removeUndefinedOfObj)(data);
        const user = yield (0, model_services_1.updateOneService)(user_model_1.default, { userAddress }, data);
        if (data.email && (!user.confirmEmail || user.email !== data.email)) {
            let html = fs_1.default.readFileSync(`${default_constant_1.STATIC_FOLDER}/views/verificationEmail.html`, { encoding: "utf8" });
            let token = jsonwebtoken_1.default.sign({ userAddress }, "secret", { expiresIn: "10m" });
            token = encodeURIComponent(token);
            let host = "https://api.nftspacex.io/aptos";
            let link = `${host}/users/verify-email/${userAddress}/${token}`;
            html = html.replace("{{link}}", link);
            yield (0, mail_services_1.sendMailService)(data.email, "Verify your email", html);
        }
        return res.status(200).json({ data: user });
    }
    catch (error) {
        return res.status(500).json({ error: "Cannot Update User" });
    }
});
exports.updateUserController = updateUserController;
const verificationEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress, token } = req.params;
        userAddress = userAddress.toLowerCase();
        token = decodeURIComponent(token);
        const user = yield (0, model_services_1.findOneService)(user_model_1.default, { userAddress });
        if (!user)
            return res.status(403).json({ error: "Not Found User" });
        const decoded = jsonwebtoken_1.default.verify(token, "secret");
        if (decoded) {
            yield (0, model_services_1.updateOneService)(user_model_1.default, { userAddress }, { confirmEmail: true });
            return res.status(200).json({ message: "Verify email successfully" });
        }
        return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
    }
    catch (error) {
        return res.status(500).json({ error: "Cannot Verify Email" });
    }
});
exports.verificationEmailController = verificationEmailController;
const logoutUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userAddress } = req.body;
        yield (0, model_services_1.updateOneService)(user_model_1.default, { userAddress }, { nonce: null });
        req.session.destroy(() => { });
        return res.status(200).json({ message: "Logout successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.logoutUserController = logoutUserController;
const getQueryUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageSize, pageId } = req.params;
    try {
        const textSearch = req.body.text;
        const sort = req.body.sort;
        const users = yield (0, user_services_1.getManyUserService)(textSearch, sort, parseInt(pageSize), parseInt(pageId));
        if (users)
            res.status(200).json(users);
        else
            res.status(403).json({ message: response_constants_1.ERROR_RESPONSE[403] });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
const getSearchUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield (0, user_services_1.getSearchUserByIdService)(userId);
        const response = {
            data: user,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
const topTraderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.query.request;
        const chainId = Number(req.params.chainId);
        return res.status(200).json(yield (0, user_services_1.topTraderService)(Number(request), Number(chainId)));
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.topTraderController = topTraderController;
const getUserProfileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userAddress } = req.params;
        const user = yield (0, model_services_1.findOneService)(user_model_1.default, { userAddress });
        return res.status(200).json({ data: user });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getUserProfileController = getUserProfileController;
const gettopTraderAutoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json(yield (0, user_services_1.gettopTraderAutoService)());
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.gettopTraderAutoController = gettopTraderAutoController;

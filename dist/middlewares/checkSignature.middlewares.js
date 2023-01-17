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
exports.refreshSignature = void 0;
const model_services_1 = require("../services/model.services");
const user_model_1 = __importDefault(require("../models/user.model"));
const response_constants_1 = require("../constant/response.constants");
// import { removeFileCloundinary } from "../services/uploadFile.service"
// const checkSignatureValid = async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const userAddress = req.params.userAddress || req.body.userAddress;
// 		const user = await findOneService(userModel, { userAddress: userAddress.toLowerCase() });
// 		if (user && user.signature.length > 0) {
// 			const isSignatureExpired = checkSignatureExpired(user);
// 			if (isSignatureExpired) return res.status(401).json({ error: ERROR_RESPONSE[401] });
// 			else return next();
// 		} else return next();
// 	} catch (error: any) {
// 		if(req.body.fileBackgroundName){
// 			removeFileCloundinary(req.body.fileBackgroundName.toString())
// 			removeFileCloundinary(req.body.fileLogoName.toString())
// 		}	
// 		console.log(error);
// 		return res.status(500).json({ error: ERROR_RESPONSE[500] });
// 	}
// };
const checkSignatureExpired = (user) => {
    const dateToMS = 86400;
    const expired_signature = Number(user.signature_expired_time);
    const remainingTime = Math.floor(Date.now() / 1000) - expired_signature;
    return remainingTime > dateToMS ? true : false;
};
const refreshSignature = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const signature = req.body.signature;
        const userAddress = req.params.userAddress || req.body.userAddress;
        const user = yield (0, model_services_1.findOneService)(user_model_1.default, { userAddress: userAddress.toLowerCase() });
        if (user && checkSignatureExpired(user)) {
            const new_signature_expired_time = Math.floor(Date.now() / 1000).toString();
            yield (0, model_services_1.updateOneService)(user_model_1.default, { userAddress: userAddress.toLowerCase() }, {
                signature,
                signature_expired_time: new_signature_expired_time,
            });
        }
        return next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.refreshSignature = refreshSignature;

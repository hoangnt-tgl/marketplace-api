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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCreateRequestMiddleware = void 0;
const response_constants_1 = require("../constant/response.constants");
/*------------@Dev:Huy--------*/
const checkCreateRequestMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { chainId, listItemId, addressINO, ownerINO, nameINO, descriptionINO, typeINO, collectionId, floorPoint } = req.body;
    // if (!typeINO || !Object.keys(INOType).includes(typeINO.toString())) {
    // 	return res.status(400).json({ error: "Type INO not valid" });
    // } else 
    if (typeINO === 1) {
        if (!collectionId) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
    }
    else {
        return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
    }
    return next();
});
exports.checkCreateRequestMiddleware = checkCreateRequestMiddleware;

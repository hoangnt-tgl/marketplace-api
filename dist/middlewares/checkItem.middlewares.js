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
exports.checkItemExistMiddleware = exports.checkItemMedia = exports.checkItemDescription = exports.checkItemName = void 0;
const model_services_1 = require("../services/model.services");
const item_services_1 = require("../services/item.services");
const checkItemExistMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemId = req.params.itemId || req.body.itemId || req.body.boxId;
        if (!itemId) {
            return res.status(400).json({ error: "Not found Item ID" });
        }
        const exist = yield (0, item_services_1.checkItemExistsService)({ _id: (0, model_services_1.createObjIdService)(itemId) });
        if (!exist) {
            return res.status(404).json({ error: "Not found Item" });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({ error: "Cannot check Item" });
    }
});
exports.checkItemExistMiddleware = checkItemExistMiddleware;
const checkItemName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { itemName } = req.body;
        if (itemName.length > 128) {
            return res.status(400).json({ error: "Collection name is too long" });
        }
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Cannot not check collection name" });
    }
});
exports.checkItemName = checkItemName;
//check desscription not over 1500 character
const checkItemDescription = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { description } = req.body;
        if (description.length > 1500) {
            return res.status(400).json({ error: "Collection description is too long" });
        }
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Cannot not check collection description" });
    }
});
exports.checkItemDescription = checkItemDescription;
const checkItemMedia = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    next();
    // const { itemMedia } = req.body.itemMedia;
    // fetch(itemMedia)
    // 	.then(res => {
    // 		if (res.ok) {
    // 			next();
    // 		}
    // 	})
    // 	.catch(err => {
    // 		return res.status(400).json({ error: "Item media is not valid" });
    // 	});
    // res.status(500).json({ error: "Item media is not valid" });
});
exports.checkItemMedia = checkItemMedia;

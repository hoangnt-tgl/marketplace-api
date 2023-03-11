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
exports.predictEventController = exports.getEventByIdController = exports.getAllEventController = exports.createEventController = void 0;
const model_services_1 = require("../services/model.services");
const item_model_1 = __importDefault(require("../models/item.model"));
const event_model_1 = __importDefault(require("../models/event.model"));
const history_model_1 = __importDefault(require("../models/history.model"));
const default_constant_1 = require("../constant/default.constant");
const createEventController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newEvent = req.body;
        newEvent.options = newEvent.options.map((option) => {
            return { name: option, value: "0" };
        });
        const { userAddress } = req.body;
        const resData = yield (0, model_services_1.createService)(event_model_1.default, newEvent);
        newEvent.options.map((option) => __awaiter(void 0, void 0, void 0, function* () {
            const item = {
                itemName: `Event #${newEvent.id} ${option.name}`,
                itemMedia: newEvent.image,
                description: newEvent.description,
                chainId: newEvent.chainId,
                priceType: newEvent.coinType,
                collectionId: default_constant_1.DEFAULT_COLLECTION_PREDICTION,
                creator: userAddress,
                owner: [userAddress],
            };
            let itemInfo = yield (0, model_services_1.createService)(item_model_1.default, item);
            let newHistory = {
                collectionId: default_constant_1.DEFAULT_COLLECTION_PREDICTION,
                itemId: itemInfo._id,
                from: userAddress,
                type: 1,
                txHash: req.body.txHash,
            };
            (0, model_services_1.createService)(history_model_1.default, newHistory);
        }));
        res.status(200).json(resData);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});
exports.createEventController = createEventController;
const getAllEventController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chainId } = req.params;
        const data = yield (0, model_services_1.findManyService)(event_model_1.default, { chainId });
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllEventController = getAllEventController;
const getEventByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId } = req.params;
        const data = yield (0, model_services_1.findOneService)(event_model_1.default, { _id: eventId });
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getEventByIdController = getEventByIdController;
const predictEventController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId, optionId } = req.params;
        const { userAddress, amount, txHash } = req.body;
        let eventInfo = yield (0, model_services_1.findOneService)(event_model_1.default, { _id: eventId });
        if (!eventInfo) {
            res.status(400).json({ message: "Event not found" });
        }
        //check user balance
        //create history
        let newHistory = {
            collectionId: default_constant_1.DEFAULT_COLLECTION_PREDICTION,
            itemId: "itemInfo",
            from: userAddress,
            quantity: amount,
            type: 15,
            txHash: txHash,
            price: amount,
            priceType: eventInfo.coinType,
        };
        (0, model_services_1.createService)(history_model_1.default, newHistory);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.predictEventController = predictEventController;

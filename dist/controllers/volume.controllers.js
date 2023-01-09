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
exports.getVolumeController = void 0;
const history_model_1 = __importDefault(require("../models/history.model"));
const price_services_1 = require("../services/price.services");
const getVolumeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const historyTrade= await findManyService(historyModel,{$or:[{from:{$ne:NULL_ADDRESS||""}},{to:{$ne:NULL_ADDRESS||""}}]});
    const historyTrade1 = yield history_model_1.default.find({ type: [2, 3] });
    const map = new Map();
    const arrayMap = new Array();
    Promise.all(historyTrade1.map((e) => __awaiter(void 0, void 0, void 0, function* () {
        const priceUsd = yield (0, price_services_1.changePriceService)(e.priceType, "usd", "1000000000000000000");
        let test = true;
        for (let [key] of map) {
            if (e.to === key) {
                map.set(key, map.get(key) + priceUsd);
                test = false;
            }
        }
        if (test) {
            map.set(e.to, priceUsd);
        }
    }))).then(() => {
        for (let [key, value] of map) {
            arrayMap.push({ addressUser: key, volume: value });
        }
        arrayMap.sort((a, b) => b.volume - a.volume);
        return res.json(arrayMap);
    }).catch((error) => {
        return res.status(500).json({ error: error });
    });
});
exports.getVolumeController = getVolumeController;

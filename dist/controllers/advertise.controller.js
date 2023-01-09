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
exports.writeHotPotVideoController = exports.getHotpotVideoController = exports.getAdvertiseNFTController = exports.getAdvertiseCollectionController = void 0;
const advertise_service_1 = require("../services/advertise.service");
const fs_1 = __importDefault(require("fs"));
const response_constants_1 = require("../constant/response.constants");
const getAdvertiseCollectionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const advertise = yield (0, advertise_service_1.getAdvertiseCollectionService)();
        return res.status(200).json({ data: advertise });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getAdvertiseCollectionController = getAdvertiseCollectionController;
const getAdvertiseNFTController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const advertise = yield (0, advertise_service_1.getAdvertiseNFTService)();
        return res.status(200).json({ data: advertise });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getAdvertiseNFTController = getAdvertiseNFTController;
const getHotpotVideoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const video = fs_1.default.readFileSync("./public/hotpot.json", { encoding: "utf8" });
        return res.status(200).json(JSON.parse(video));
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getHotpotVideoController = getHotpotVideoController;
const writeHotPotVideoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotpot = req.body.hotpot;
        if (!hotpot) {
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        }
        fs_1.default.writeFileSync("./public/hotpot.json", JSON.stringify({ data: hotpot }));
        return res.status(200).json({ success: "Write success" });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.writeHotPotVideoController = writeHotPotVideoController;

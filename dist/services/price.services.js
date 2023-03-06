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
exports.createToken = exports.createTokenService = void 0;
const token_model_1 = __importDefault(require("../models/token.model"));
const model_services_1 = require("./model.services");
const createTokenService = (chainId, tokenName, tokenSymbol, officialSymbol, coingeckoId, decimal, logoURI, projectUrl, tokenAddress, tokenType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newToken = new token_model_1.default({
            chainId: chainId,
            tokenName: tokenName,
            tokenSymbol: tokenSymbol,
            tokenAddress: tokenAddress,
            decimal: decimal,
            logoURI: logoURI,
            officialSymbol: officialSymbol,
            coingeckoId: coingeckoId,
            projectUrl: projectUrl,
            tokenType: tokenType,
        });
        return yield newToken.save();
    }
    catch (err) {
        return err;
    }
});
exports.createTokenService = createTokenService;
const createToken = (chainId, tokenName, tokenSymbol, officialSymbol, coingeckoId, decimal, logoURI, projectUrl, tokenAddress, tokenType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, model_services_1.createService)(token_model_1.default, {
            chainId,
            tokenName,
            tokenSymbol,
            officialSymbol,
            coingeckoId,
            decimal,
            logoURI,
            projectUrl,
            tokenAddress,
            tokenType
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.createToken = createToken;

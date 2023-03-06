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
exports.getAllTokenController = exports.createTokenController = void 0;
const price_services_1 = require("../services/price.services");
const token_services_1 = require("../services/token.services");
const createTokenController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.body;
        yield Promise.all(token.map((tokens) => __awaiter(void 0, void 0, void 0, function* () {
            const chainId = 2;
            const tokenName = tokens.name;
            const tokenAddress = tokens.token_type.account_address;
            const tokenSymbol = tokens.symbol;
            const decimal = tokens.decimals;
            const logoURI = tokens.logo_url;
            const officialSymbol = tokens.official_symbol;
            const coingeckoId = tokens.coingecko_id;
            const projectUrl = tokens.project_url;
            const tokenType = tokens.token_type.type;
            yield (0, price_services_1.createToken)(chainId, tokenName, tokenSymbol, officialSymbol, coingeckoId, decimal, logoURI, projectUrl, tokenAddress, tokenType);
        })));
        // let { chainId, tokenName, tokenAddress, tokenSymbol, decimal, logoURI, isNative } = req.body;
        // console.log(chainId, " - " ,tokenName, " - " , tokenAddress, " - " , tokenSymbol, " - " , decimal, " - " , logoURI, " - " , isNative);
        // let result = await createTokenService(chainId, tokenName, tokenSymbol, tokenAddress, decimal, logoURI, isNative);
        return res.status(200).json("Success");
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.createTokenController = createTokenController;
const getAllTokenController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield (0, token_services_1.getAllTokenService)();
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.getAllTokenController = getAllTokenController;

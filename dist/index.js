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
const app_1 = require("./app");
const collection_services_1 = require("./services/collection.services");
(0, app_1.runningApp)();
const UPDATE_TOP_COLLECTION_TIME = Number(process.env.UPDATE_TOP_COLLECTION_TIME) || 1000 * 5;
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, collection_services_1.writeTopCollectionService)();
}), Number(process.env.UPDATE_TOP_COLLECTION_TIME));

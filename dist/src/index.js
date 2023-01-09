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
const contract_constant_1 = require("./constant/contract.constant");
const collection_services_1 = require("./services/collection.services");
const event_services_1 = require("./services/event.services");
(0, app_1.runningApp)();
const network = Object.keys(contract_constant_1.COLLECTION_ADDRESS);
network.map((net) => {
    net = Number(net);
    (0, event_services_1.getPastMadeBidEvent)(net);
    (0, event_services_1.listenMadeBidEvent)(net);
});
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, collection_services_1.writeTopCollectionService)();
}), Number(process.env.UPDATE_TOP_COLLECTION_TIME));

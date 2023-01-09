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
exports.changeIsWatchedNotifyService = exports.getManyNotifyService = exports.getOneNotifyService = exports.checkNotifyExistsService = exports.createNotifyService = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
const model_services_1 = require("./model.services");
const createNotifyService = (userAddress, type, detail, objectId, isWatched = false) => __awaiter(void 0, void 0, void 0, function* () {
    const newObj = {
        userAddress,
        type,
        detail,
        objectId: (0, model_services_1.createObjIdService)(objectId),
        isWatched,
    };
    let notification = yield (0, model_services_1.createService)(notification_model_1.default, newObj);
    return returnNotifyService(notification);
});
exports.createNotifyService = createNotifyService;
const checkNotifyExistsService = (queryObj) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, model_services_1.queryExistService)(notification_model_1.default, queryObj);
});
exports.checkNotifyExistsService = checkNotifyExistsService;
const getOneNotifyService = (objQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const notify = yield (0, model_services_1.findOneService)(notification_model_1.default, Object.assign(Object.assign({}, objQuery), { isWatched: false }));
    return returnNotifyService(notify);
});
exports.getOneNotifyService = getOneNotifyService;
const getManyNotifyService = (objQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const notifies = yield (0, model_services_1.findManyService)(notification_model_1.default, Object.assign(Object.assign({}, objQuery), { isWatched: false }), '', { createdAt: -1 });
    const listNotifies = [];
    for (let i = 0; i < notifies.length; i++) {
        listNotifies.push(returnNotifyService(notifies[i]));
    }
    return listNotifies;
});
exports.getManyNotifyService = getManyNotifyService;
const changeIsWatchedNotifyService = (userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, model_services_1.updateManyService)(notification_model_1.default, { userAddress }, { isWatched: true });
    }
    catch (error) {
        console.log(error.message);
        return null;
    }
});
exports.changeIsWatchedNotifyService = changeIsWatchedNotifyService;
const returnNotifyService = (notify) => {
    const returnValue = {
        notificationId: notify._id,
        userAddress: notify.userAddress,
        detail: notify.detail,
        objectId: notify.objectId,
        isWatched: notify.isWatched,
    };
    return returnValue;
};

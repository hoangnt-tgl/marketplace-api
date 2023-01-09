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
exports.getOneNotifyBoardService = exports.getNotifyBoardService = exports.createNotifyBoardService = exports.returnNotifyBoardService = exports.changeIsWatchedNotifyService = exports.getManyNotifyService = exports.getOneNotifyService = exports.checkNotifyExistsService = exports.createNotifyService = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
const notificationBoard_model_1 = __importDefault(require("../models/notificationBoard.model"));
const model_services_1 = require("./model.services");
const other_services_1 = require("./other.services");
const createNotifyService = (title, type, interactWith, content, objectId) => __awaiter(void 0, void 0, void 0, function* () {
    const newObj = {
        title,
        type,
        interactWith,
        content,
        objectId: (0, model_services_1.createObjIdService)(objectId),
    };
    let notification = yield (0, model_services_1.createService)(notification_model_1.default, newObj);
    return returnNotifyService(notification);
});
exports.createNotifyService = createNotifyService;
const createNotifyBoardService = (userAddress, notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    const newObj = {
        userAddress,
        notificationId: (0, model_services_1.createObjIdService)(notificationId),
    };
    let notificationBoard = yield (0, model_services_1.createService)(notificationBoard_model_1.default, newObj);
    return returnNotifyBoardService(notificationBoard);
});
exports.createNotifyBoardService = createNotifyBoardService;
const checkNotifyExistsService = (queryObj) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, model_services_1.queryExistService)(notification_model_1.default, queryObj);
});
exports.checkNotifyExistsService = checkNotifyExistsService;
const getOneNotifyService = (objQuery, properties = "") => __awaiter(void 0, void 0, void 0, function* () {
    const obj = (0, other_services_1.removeUndefinedOfObj)(objQuery);
    const notify = yield notification_model_1.default
        .findOne(obj, properties)
        .lean()
        .populate({ path: "itemInfo" })
        .populate({ path: "auctionInfo" });
    return returnNotifyBoardService(notify);
});
exports.getOneNotifyService = getOneNotifyService;
const getOneNotifyBoardService = (objQuery, properties = "") => __awaiter(void 0, void 0, void 0, function* () {
    const obj = (0, other_services_1.removeUndefinedOfObj)(objQuery);
    const notify = yield notificationBoard_model_1.default
        .findOne(obj, properties)
        .lean()
        .populate({ path: "notificationInfo" })
        .populate({ path: "user" });
    return returnNotifyBoardService(notify);
});
exports.getOneNotifyBoardService = getOneNotifyBoardService;
const getManyNotifyService = (objQuery, properties = "") => __awaiter(void 0, void 0, void 0, function* () {
    const obj = (0, other_services_1.removeUndefinedOfObj)(objQuery);
    const notifies = yield notification_model_1.default
        .find(obj, properties)
        .lean()
        .populate({ path: "itemInfo" })
        .populate({ path: "auctionInfo" });
    const listNotifies = [];
    for (let i = 0; i < notifies.length; i++) {
        listNotifies.push(returnNotifyService(notifies[i]));
    }
    return listNotifies;
});
exports.getManyNotifyService = getManyNotifyService;
const getNotifyBoardService = (objQuery, properties = "") => __awaiter(void 0, void 0, void 0, function* () {
    const obj = (0, other_services_1.removeUndefinedOfObj)(objQuery);
    const notifies = yield notificationBoard_model_1.default
        .find(obj, properties)
        .lean()
        .populate({ path: "notificationInfo" })
        .populate({ path: "user" });
    const listNotifies = [];
    for (let i = 0; i < notifies.length; i++) {
        listNotifies.push(returnNotifyBoardService(notifies[i]));
    }
    return listNotifies;
});
exports.getNotifyBoardService = getNotifyBoardService;
const changeIsWatchedNotifyService = (userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, model_services_1.updateOneService)(notification_model_1.default, { userAddress }, { isWatched: true });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.changeIsWatchedNotifyService = changeIsWatchedNotifyService;
const returnNotifyBoardService = (notify) => {
    const returnValue = {
        _id: notify._id,
        userAddress: notify.userAddress,
        isWatched: notify.isWatched,
        notificationId: notify.notificationId,
        isDeleted: notify.isDeleted
    };
    return returnValue;
};
exports.returnNotifyBoardService = returnNotifyBoardService;
const returnNotifyService = (notify) => {
    const returnValue = {
        _id: notify._id,
        title: notify.title,
        type: notify.type,
        interactWith: notify.interactWith,
        content: notify.content,
        objectId: notify.objectId,
        isDeleted: notify.isDeleted
    };
    return returnValue;
};

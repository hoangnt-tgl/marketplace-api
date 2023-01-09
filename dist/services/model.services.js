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
exports.deleteManyService = exports.countByQueryService = exports.createObjIdService = exports.deleteOneService = exports.deleteObjService = exports.updateObjService = exports.findManyService = exports.findOneService = exports.queryItemsOfModelInPageService = exports.updateManyService = exports.updateOneService = exports.queryExistService = exports.createService = void 0;
const other_services_1 = require("./other.services");
const mongoose_1 = __importDefault(require("mongoose"));
const createObjIdService = (id) => {
    const objId = new mongoose_1.default.Types.ObjectId(id);
    return objId;
};
exports.createObjIdService = createObjIdService;
const createService = (model, newObject) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield new model(newObject);
    yield result.save();
    return result;
});
exports.createService = createService;
const queryExistService = (model, objectQuery) => __awaiter(void 0, void 0, void 0, function* () {
    objectQuery = (0, other_services_1.removeUndefinedOfObj)(objectQuery);
    return yield model.exists(objectQuery);
});
exports.queryExistService = queryExistService;
const countByQueryService = (model, objectQuery) => __awaiter(void 0, void 0, void 0, function* () {
    objectQuery = (0, other_services_1.removeUndefinedOfObj)(objectQuery);
    return yield model.count(objectQuery);
});
exports.countByQueryService = countByQueryService;
const queryItemsOfModelInPageService = (model, objectQuery, page = 1, pageSize = 8, sortObj = { createdAt: -1 }, properties = "") => __awaiter(void 0, void 0, void 0, function* () {
    objectQuery = (0, other_services_1.removeUndefinedOfObj)(objectQuery);
    const currentPage = Number(page);
    const totalItems = yield model.countDocuments(objectQuery);
    const totalPages = Math.ceil(totalItems / pageSize);
    try {
        const items = 0 < currentPage && currentPage <= totalPages
            ? yield model
                .find(objectQuery, properties)
                .lean()
                .allowDiskUse(true)
                .sort(sortObj)
                .skip(pageSize * (currentPage - 1))
                .limit(pageSize)
            : [];
        const obj = {
            data: items,
            pagination: {
                totalItems,
                pageSize,
                currentPage,
                totalPages,
            },
        };
        return obj;
    }
    catch (error) {
        console.log(error.message);
    }
    return {
        data: [],
        pagination: {
            totalItems,
            pageSize,
            currentPage,
            totalPages,
        },
    };
});
exports.queryItemsOfModelInPageService = queryItemsOfModelInPageService;
const updateOneService = (model, objectQuery, objectUpdate, option = { new: true, returnOriginal: false }) => __awaiter(void 0, void 0, void 0, function* () {
    objectQuery = (0, other_services_1.removeUndefinedOfObj)(objectQuery);
    objectUpdate = (0, other_services_1.removeUndefinedOfObj)(objectUpdate);
    const result = yield model.findOneAndUpdate(objectQuery, objectUpdate, option);
    return result;
});
exports.updateOneService = updateOneService;
const findOneService = (model, objQuery, properties = "", hintObj = { _id: 1 }) => __awaiter(void 0, void 0, void 0, function* () {
    objQuery = (0, other_services_1.removeUndefinedOfObj)(objQuery);
    const result = yield model.findOne(objQuery, properties).hint(hintObj).lean();
    return result;
});
exports.findOneService = findOneService;
const findManyService = (model, objQuery, properties = "", sortObj = { createdAt: -1 }, limit = NaN, hintObj = { _id: 1 }) => __awaiter(void 0, void 0, void 0, function* () {
    objQuery = (0, other_services_1.removeUndefinedOfObj)(objQuery);
    const result = yield model.find(objQuery, properties).lean().sort(sortObj).limit(limit).hint(hintObj);
    return result;
});
exports.findManyService = findManyService;
const updateManyService = (model, objectQuery, objectUpdate, option = { new: true }) => __awaiter(void 0, void 0, void 0, function* () {
    objectQuery = (0, other_services_1.removeUndefinedOfObj)(objectQuery);
    objectUpdate = (0, other_services_1.removeUndefinedOfObj)(objectUpdate);
    const result = yield model.updateMany(objectQuery, objectUpdate, option);
    return result;
});
exports.updateManyService = updateManyService;
const updateObjService = (model, objQuery, obj, property, value) => __awaiter(void 0, void 0, void 0, function* () {
    objQuery = (0, other_services_1.removeUndefinedOfObj)(objQuery);
    const update = `{ "${obj}.${property}": "${value}" }`;
    const result = yield model.updateOne(objQuery, {
        $set: JSON.parse(update),
    });
    return result;
});
exports.updateObjService = updateObjService;
const deleteObjService = (model, objQuery, obj, property) => __awaiter(void 0, void 0, void 0, function* () {
    objQuery = (0, other_services_1.removeUndefinedOfObj)(objQuery);
    const del = `{ "${obj}.${property}": 1 }`;
    const result = yield model.updateOne(objQuery, { $unset: JSON.parse(del) });
    return result;
});
exports.deleteObjService = deleteObjService;
const deleteOneService = (model, objQuery) => __awaiter(void 0, void 0, void 0, function* () {
    objQuery = (0, other_services_1.removeUndefinedOfObj)(objQuery);
    const result = yield model.findOneAndDelete(objQuery);
    return result;
});
exports.deleteOneService = deleteOneService;
const deleteManyService = (model, objQuery) => __awaiter(void 0, void 0, void 0, function* () {
    objQuery = (0, other_services_1.removeUndefinedOfObj)(objQuery);
    const result = yield model.deleteMany(objQuery);
    return result;
});
exports.deleteManyService = deleteManyService;

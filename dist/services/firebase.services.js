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
exports.uploadFileToFirebaseService = exports.getFileFromFireBaseService = void 0;
const app_1 = require("@firebase/app");
const storage_1 = require("@firebase/storage");
const other_services_1 = require("./other.services");
const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
};
const firebaseApp = (0, app_1.initializeApp)(firebaseConfig);
const storage = (0, storage_1.getStorage)(firebaseApp);
const getFileFromFireBaseService = (fileLocation) => __awaiter(void 0, void 0, void 0, function* () {
    const gsReference = (0, storage_1.ref)(storage, fileLocation);
    const url = yield (0, storage_1.getDownloadURL)(gsReference);
    const result = yield (0, other_services_1.getDataFromURL)(url);
    return result;
});
exports.getFileFromFireBaseService = getFileFromFireBaseService;
const uploadFileToFirebaseService = (fileName, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storageRef = (0, storage_1.ref)(storage, fileName);
        const result = yield (0, storage_1.uploadString)(storageRef, data);
        if (result) {
            return true;
        }
    }
    catch (error) {
        console.log(error.message);
    }
    return false;
});
exports.uploadFileToFirebaseService = uploadFileToFirebaseService;

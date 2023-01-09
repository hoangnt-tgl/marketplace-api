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
exports.checkUploadService = exports.uploadVideoToStorageService = exports.uploadFileToIpfsService = exports.uploadImageToStorageService = void 0;
const sharp_1 = __importDefault(require("sharp"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
const uploadIPFS_1 = require("../utils/uploadIPFS");
const fs_1 = __importDefault(require("fs"));
const default_constant_1 = require("../constant/default.constant");
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET } = process.env;
const cloud = cloudinary_1.default.v2;
cloud.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET,
});
const uploadImageToStorageService = (folderName, fileName, image) => __awaiter(void 0, void 0, void 0, function* () {
    const sharpImg = (0, sharp_1.default)(image);
    const meta = yield sharpImg.metadata();
    const format = meta.format;
    const compressImage = yield sharpImg[format](default_constant_1.FILE_EXTEND[format])
        .resize(1000)
        .toFormat("avif", { palette: true })
        .toBuffer();
    const promise = () => {
        return new Promise((resolve, rejects) => {
            const uploadResponse = cloud.uploader.upload_stream({
                folder: folderName,
                public_id: fileName,
            }, (error, result) => {
                if (error) {
                    rejects(error);
                }
                else {
                    resolve(result.url);
                }
            });
            streamifier_1.default.createReadStream(compressImage).pipe(uploadResponse);
        });
    };
    const result = yield promise();
    return result;
});
exports.uploadImageToStorageService = uploadImageToStorageService;
const uploadVideoToStorageService = (folderName, fileName, videoPath) => __awaiter(void 0, void 0, void 0, function* () {
    const promise = () => {
        return new Promise((resolve, rejects) => {
            cloud.uploader.upload(videoPath, {
                resource_type: "video",
                public_id: fileName,
                folder: folderName,
            }, (error, result) => {
                if (error) {
                    rejects(error);
                }
                else {
                    resolve(result.url);
                }
            });
        });
    };
    return yield promise();
});
exports.uploadVideoToStorageService = uploadVideoToStorageService;
const checkUploadService = (result, checkImage = false) => {
    if (!result) {
        return "Upload failed";
    }
    if (result.size > default_constant_1.IMAGE_MAX_SIZE) {
        return "File size too large";
    }
    const extend = result.mimetype.split("/")[1];
    if (!default_constant_1.FILE_EXTEND[extend]) {
        return "File is not support";
    }
    if (checkImage) {
        if (result.mimetype.split("/")[0] !== "image") {
            return "Image upload only";
        }
    }
    return "";
};
exports.checkUploadService = checkUploadService;
const uploadFileToIpfsService = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const readFile = fs_1.default.readFileSync(file);
    const ipfs = yield (0, uploadIPFS_1.addIPFS)(readFile);
    const url = "https://ipfs.io/ipfs/" + ipfs.path;
    return { url: url, cid: ipfs.path };
});
exports.uploadFileToIpfsService = uploadFileToIpfsService;

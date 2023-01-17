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
exports.uploadFileToIpfs = void 0;
const formidable_1 = __importDefault(require("formidable"));
const uploadFile_service_1 = require("../services/uploadFile.service");
const handlePromiseUpload = (form, req, filename) => {
    return new Promise((resolve, rejects) => {
        let fileURL;
        form.parse(req, (error, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                rejects(error);
            }
            else {
                console.log(files);
                resolve(files);
                // const msg = checkUploadService(files.file, true);
                // if (msg) {
                // 	rejects(msg);
                // } else {
                // 	const type = files.file.mimetype.split("/")[1];
                // 	if (type === "gif" || type === "webp") {
                // 		fileURL = await uploadFileToStorageService(filename, Date.now().toString(), files.file.filepath, true);
                // 	} else {
                // 		fileURL = await uploadImageToStorageService(filename, Date.now().toString(), files.file.filepath);
                // 	}
                // 	if (fileURL) {
                // 		resolve(fileURL);
                // 	} else {
                // 		rejects(fileURL);
                // 	}
                // }
            }
        }));
    });
};
const uploadFileToIpfs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = (0, formidable_1.default)();
        let files = yield handlePromiseUpload(form, req, "test");
        console.log(files.file);
        const file = yield (0, uploadFile_service_1.uploadFileToIpfsService)(files.file.filepath);
        return res.status(200).json({ data: file });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.uploadFileToIpfs = uploadFileToIpfs;

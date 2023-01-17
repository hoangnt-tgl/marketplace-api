"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATIC_FOLDER = exports.FILE_EXTEND = exports.DEFAULT_CHAIN_ID = exports.IMAGE_MAX_SIZE = exports.DEFAULT_NAME = exports.DEFAULT_OFFER_ITEM_STATUS = exports.DEFAULT_ITEM_STATUS = exports.DEFAULT_ITEM_CATEGORY = exports.NULL_ADDRESS = exports.DEFAULT_STANDARD = exports.DEFAULT_AVATAR = exports.DEFAULT_PICTURE = void 0;
const path_1 = __importDefault(require("path"));
exports.DEFAULT_PICTURE = "https://res.cloudinary.com/dbb2csh01/image/upload/v1673315233/meta-asset/background_gs0eqv.jpg";
exports.DEFAULT_AVATAR = "https://res.cloudinary.com/dbb2csh01/image/upload/v1673315223/meta-asset/avatar_default_jurfhx.png";
exports.DEFAULT_STANDARD = "ERC1155";
exports.NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
exports.DEFAULT_ITEM_CATEGORY = 0;
exports.DEFAULT_ITEM_STATUS = 0;
exports.DEFAULT_OFFER_ITEM_STATUS = 0;
exports.DEFAULT_NAME = "Anonymous";
exports.IMAGE_MAX_SIZE = 50000000;
exports.DEFAULT_CHAIN_ID = 4;
exports.FILE_EXTEND = {
    jpeg: { quality: 80 },
    webp: { quality: 50 },
    png: { compressionLevel: 8 },
    gif: {},
    svg: {},
    mp4: {},
    webm: {},
    mp3: {},
    wav: {},
    ogg: {},
    glb: {},
    gltf: {},
    mpeg: {},
    avif: {},
    json: {},
};
exports.STATIC_FOLDER = path_1.default.join(__dirname, "../../");

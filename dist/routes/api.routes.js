"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path")); // use for static route
const user_routes_1 = __importDefault(require("./user.routes"));
const collection_routes_1 = __importDefault(require("./collection.routes"));
const item_routes_1 = __importDefault(require("./item.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const test_routes_1 = __importDefault(require("./test.routes"));
const APIRouter = express_1.default.Router();
APIRouter.use("/static", express_1.default.static(path_1.default.join(__dirname, "../../public")));
APIRouter.use("/users", user_routes_1.default);
APIRouter.use("/collection", collection_routes_1.default);
APIRouter.use("/item", item_routes_1.default);
APIRouter.use("/order", order_routes_1.default);
APIRouter.use("/test", test_routes_1.default);
exports.default = APIRouter;

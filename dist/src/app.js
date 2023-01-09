"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runningApp = exports.io = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_config_1 = require("./config/db.config");
const path = __importStar(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cors_config_1 = require("./config/cors.config");
const api_routes_1 = __importDefault(require("./routes/api.routes"));
const os_1 = __importDefault(require("os"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const notifyService_1 = require("./services/notifyService");
process.env.UV_THREADPOOL_SIZE = os_1.default.cpus().length;
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server);
const runningApp = () => {
    (0, db_config_1.connectDB)();
    app.set("port", port);
    app.set("views", path.join(__dirname, "../views"));
    app.set("view engine", "pug");
    app.use(express_1.default.static('../../public'));
    app.use(express_1.default.urlencoded({ limit: "5000mb", extended: true, parameterLimit: 500000 }));
    app.use(express_1.default.json({ limit: '5000mb' }));
    app.use((0, cors_1.default)(cors_config_1.corsOptions));
    app.use((0, morgan_1.default)("dev"));
    app.use("/", api_routes_1.default);
    server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
    (0, notifyService_1.socketApp)();
};
exports.runningApp = runningApp;

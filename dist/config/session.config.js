"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionConfig = void 0;
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
require("dotenv").config();
exports.sessionConfig = (0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "",
    name: "metaspacecy_token",
    resave: false,
    saveUninitialized: true,
    store: connect_mongo_1.default.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        httpOnly: true,
        maxAge: 86400 * 1000,
        secure: false
    },
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const { USERNAME_DB, PASSWORD_DB, NAME_DB } = process.env;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => {
    try {
        mongoose_1.default.connect(`mongodb+srv://${USERNAME_DB}:${PASSWORD_DB}@cluster0.gzirr.mongodb.net/${NAME_DB}?retryWrites=true&w=majority`, error => {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Connect successfully to database!");
            }
        });
    }
    catch (error) {
        console.log(error.message);
    }
};
exports.connectDB = connectDB;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    secure: false,
    auth: {
        user: process.env.EMAIL_ADDRESS || "space.tronghoang@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "rdrgqlgvykhrbblv",
    },
});
transporter.verify((error, success) => {
    if (error) {
        console.log({ error });
    }
    else {
        console.log("Server is ready to take our messages");
    }
});
exports.default = transporter;

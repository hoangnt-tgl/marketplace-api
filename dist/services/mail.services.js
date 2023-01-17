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
exports.sendMailService = void 0;
const mail_config_1 = __importDefault(require("../config/mail.config"));
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS || "space.tronghoang@gmail.com";
const sendMailService = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: EMAIL_ADDRESS,
        to: to,
        subject: subject,
        html: html,
    };
    try {
        const promise = () => {
            return new Promise((resolve, rejects) => {
                mail_config_1.default.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        rejects(error);
                    }
                    else {
                        resolve(info);
                    }
                });
            });
        };
        const result = yield promise();
        console.log(result);
        return result;
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendMailService = sendMailService;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
(0, app_1.runningApp)();
const UPDATE_TOP_COLLECTION_TIME = Number(process.env.UPDATE_TOP_COLLECTION_TIME) || 1000 * 5;
// setInterval(async () => {
// 	await writeTopCollectionService();
// }, Number(<any>process.env.UPDATE_TOP_COLLECTION_TIME));

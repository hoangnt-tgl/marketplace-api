import { runningApp } from "./app";
import { writeTopCollectionService } from "./services/collection.services";

runningApp();

const UPDATE_TOP_COLLECTION_TIME = Number(<any>process.env.UPDATE_TOP_COLLECTION_TIME) || 1000 * 5;

// setInterval(async () => {
// 	await writeTopCollectionService();
// }, Number(<any>process.env.UPDATE_TOP_COLLECTION_TIME));
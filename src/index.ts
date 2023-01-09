import { runningApp } from "./app";
import { updateIsINOController } from "./controllers/ino.controller";
import { writeTopCollectionService, updateTotalFromContractService, updateVolumeTrade } from "./services/collection.services";
import { removeFileCloundinary } from "./services/uploadFile.service"
runningApp();

// setInterval(async () => {
// 	await writeTopCollectionService();
// }, Number(<any>process.env.UPDATE_TOP_COLLECTION_TIME));

// setInterval(async () => {
// 	await updateTotalFromContractService();
// }, Number(<any>process.env.UPDATE_TOTALNFT_COLLECTION));

// setInterval(async () => {
// 	await updateVolumeTrade();
// }, Number(<any>process.env.UPDATE_VOLUMETRADE));
// // (async () => {await removeFileCloundinary("collections","1672040942146");})();

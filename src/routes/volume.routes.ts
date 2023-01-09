import express from "express";
import { getVolumeController } from "../controllers/volume.controllers";


const volumeRouter = express.Router();

volumeRouter.get("/getVolume", getVolumeController);

export default volumeRouter;
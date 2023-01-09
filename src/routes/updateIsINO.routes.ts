import express from "express";
import { updateIsINOController } from "../controllers/ino.controller"

const updateIsINO = express.Router();


updateIsINO.get('/updateIsINO', updateIsINOController)

export default updateIsINO
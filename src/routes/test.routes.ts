import express from "express";

import { uploadFileToIpfs } from "../controllers/test.controllers";

const testRouter = express.Router();

testRouter.post("/", uploadFileToIpfs);

export default testRouter;

import express from "express";
import { createTokenController, getAllTokenController } from "../controllers/token.controllers";
const tokenRouter = express.Router();

/* ******************************************
 *				POST ROUTE					                *
 ********************************************/

tokenRouter.post("/create", createTokenController);

/* ******************************************
 *				PUT ROUTE					                *
 ********************************************/


/* ******************************************
 *				GET ROUTE					                *
 ********************************************/
tokenRouter.get("/get", getAllTokenController);

export default tokenRouter;



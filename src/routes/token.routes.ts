import express from "express";
import { createTokenController } from "../controllers/token.controllers";
const tokenRouter = express.Router();

/* ******************************************
 *				POST ROUTE					                *
 ********************************************/

tokenRouter.post("/create" , createTokenController);

/* ******************************************
 *				PUT ROUTE					                *
 ********************************************/


/* ******************************************
 *				GET ROUTE					                *
 ********************************************/


export default tokenRouter;

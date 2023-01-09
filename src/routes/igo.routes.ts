import express from "express";
import { checkCreateIGOMiddleware } from "../middlewares/checkIGO.middlewares";
import { createIGOController, getIGOByIdController, queryIGOController } from "../controllers/igo.controllers";
import { checkINOExistMiddleware } from "../middlewares/ino.middleware";
import { checkPageIdMiddleware } from "../middlewares/checkOther.middlewares";

const igoRouter = express.Router();

/* ******************************************
 *				 POST ROUTE				    *
 ********************************************/

igoRouter.post("/create", checkCreateIGOMiddleware, createIGOController);

igoRouter.post("/query/pageSize/:pageSize/page/:pageId", checkPageIdMiddleware, queryIGOController);

/* ******************************************
 *				  GET ROUTE				    *
 ********************************************/
igoRouter.get("/:igoId", getIGOByIdController);

export default igoRouter;

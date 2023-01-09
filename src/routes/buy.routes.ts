import express from "express";
import { createBuyController } from "../controllers/buy.controllers";
import { checkChainIdMiddleware } from "../middlewares/checkOther.middlewares";
import { checkItemExistMiddleware } from "../middlewares/checkItem.middleware";
import { checkUserExistMiddleware, checkUserMatchOnBlockchain } from '../middlewares/checkUser.middlewares'

const buyRouter = express.Router();

/* ******************************************
 *				  POST ROUTE					            *
 ********************************************/

buyRouter.post(
  "/create",
  checkUserMatchOnBlockchain,
  checkChainIdMiddleware,
  checkUserExistMiddleware,
  checkItemExistMiddleware,
  createBuyController
);

export default buyRouter;
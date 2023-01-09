import express from "express";
import { createSellController } from "../controllers/sell.controllers";
import { checkItemExistMiddleware, checkOwnerItemMiddleware, checkItemSelling } from "../middlewares/checkItem.middleware";
import { checkUserExistMiddleware, checkUserMatchOnBlockchain } from '../middlewares/checkUser.middlewares'
import { checkChainIdMiddleware } from "../middlewares/checkOther.middlewares";
const sellRouter = express.Router();


/* ******************************************
 *			      	POST ROUTE					        *
 ********************************************/

sellRouter.post(
  "/create",
  checkUserMatchOnBlockchain,
  checkChainIdMiddleware,
  checkUserExistMiddleware,
  checkOwnerItemMiddleware,
  checkItemExistMiddleware,
  // checkItemSelling,
  createSellController
);

export default sellRouter;
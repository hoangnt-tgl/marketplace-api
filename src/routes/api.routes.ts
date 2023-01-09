import express from "express";
import path from "path"; // use for static route
import collectionRouter from "./collection.routes";
import historyRouter from "./history.routes";
import itemRouter from "./item.routes";
import userRouter from "./user.routes";
import sellRouter from "./sell.routes";
import buyRouter from "./buy.routes";
import orderRouter from "./order.routes";
import interactionRouter from "./interaction.routes";
import offerRouter from "../routes/offer.routes";
import auctionRouter from "./auction.routes";
import notifyRouter from "./notification.routes";
import adminRouter from "./admin.routes";
import advertiseRouter from "./advertise.routes";
import stakingRouter from "./staking.routes";
import inoRouter from "./ino.routes";
import igoRouter from "./igo.routes";
import galleryRouter from "./gallery.routes";
import tokenRouter from "./token.routes";
import volumeRoutes from "./volume.routes";
import updateIsINO from "./updateIsINO.routes"

const APIRouter = express.Router();

APIRouter.use("/static", express.static(path.join(__dirname, "../../public")));

APIRouter.use("/users", userRouter);

APIRouter.use("/collections", collectionRouter);

APIRouter.use("/items", itemRouter);

APIRouter.use("/sell", sellRouter);

APIRouter.use("/buy", buyRouter);

APIRouter.use("/histories", historyRouter);

APIRouter.use("/orders", orderRouter);

APIRouter.use("/interactions", interactionRouter);

APIRouter.use("/offers", offerRouter);

APIRouter.use("/auctions", auctionRouter);

APIRouter.use("/notifications", notifyRouter);

APIRouter.use("/admin", adminRouter);

APIRouter.use("/promotion", advertiseRouter);

APIRouter.use("/staking", stakingRouter);

APIRouter.use("/INO", inoRouter);

APIRouter.use("/igo", igoRouter);

APIRouter.use("/updateIsINO", updateIsINO)

APIRouter.use("/staking", stakingRouter);

APIRouter.use("/gallery", galleryRouter);

APIRouter.use("/token", tokenRouter);
APIRouter.use("/volume", volumeRoutes);

export default APIRouter;

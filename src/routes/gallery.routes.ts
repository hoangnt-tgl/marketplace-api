import express from "express";

import { loadGalleryController, setPositionController } from "../controllers/gallery.controllers";
import { addTemplateController } from "../controllers/gallery.controllers";

const galleryRouter = express.Router();

galleryRouter.post("/add", addTemplateController);

galleryRouter.post("/load", loadGalleryController);

galleryRouter.post("/set", setPositionController);

export default galleryRouter;

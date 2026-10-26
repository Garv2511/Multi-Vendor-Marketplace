import { Router } from "express";
import { vendorDataController } from "../controllers/vendor-data.controller.js";

const router = Router();

router.get("/", vendorDataController);

export { router as vendorDataRouter };
export default router;

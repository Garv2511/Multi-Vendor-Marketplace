import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";

const router = Router();

router.post("/", adminController);
router.get("/", adminController);

export { router as adminRouter };
export default router;

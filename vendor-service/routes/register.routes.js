import { Router } from "express";
import { registerController } from "../controllers/register.controller.js";

const router = Router();

router.post("/", registerController);

export { router as registerRouter };
export default router;

import { Router } from "express";
import {
    getCustomerProfileController,
    updateCustomerProfileController,
    listAddressesController,
    addAddressController,
    getAddressController,
    updateAddressController,
    deleteAddressController,
    setDefaultAddressController
} from "../controllers/customer.controller.js";
import { requireCustomer } from "../middlewares/auth.js";

const router = Router();

router.get("/me", requireCustomer, getCustomerProfileController);
router.patch("/me", requireCustomer, updateCustomerProfileController);
router.get("/me/addresses", requireCustomer, listAddressesController);
router.post("/me/addresses", requireCustomer, addAddressController);
router.get("/me/addresses/:addressId", requireCustomer, getAddressController);
router.patch("/me/addresses/:addressId", requireCustomer, updateAddressController);
router.delete("/me/addresses/:addressId", requireCustomer, deleteAddressController);
router.patch("/me/addresses/:addressId/default", requireCustomer, setDefaultAddressController);

export { router as customerRouter };
export default router;

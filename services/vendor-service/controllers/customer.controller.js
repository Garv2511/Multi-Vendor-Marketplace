import {
    getCustomerProfile,
    updateCustomerProfile,
    listAddresses,
    addAddress,
    getAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    resolveOwnedAddress
} from "../services/customer.service.js";

export const getCustomerProfileController = async (req, res) => {
    try {
        const profile = await getCustomerProfile(req.user.userId);
        return res.status(200).json({
            message: "Customer profile fetched successfully",
            data: profile
        });
    } catch (error) {
        console.error("Error in getCustomerProfileController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while fetching customer profile"
        });
    }
};

export const updateCustomerProfileController = async (req, res) => {
    try {
        const profile = await updateCustomerProfile(req.user.userId, req.body);
        return res.status(200).json({ message: "Customer profile updated successfully", data: profile });
    } catch (error) {
        console.error("Error in updateCustomerProfileController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while updating customer profile"
        });
    }
};

export const listAddressesController = async (req, res) => {
    try {
        const addresses = await listAddresses(req.user.userId);
        return res.status(200).json({ message: "Customer addresses fetched successfully", data: addresses });
    } catch (error) {
        console.error("Error in listAddressesController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while fetching addresses"
        });
    }
};

export const addAddressController = async (req, res) => {
    try {
        const address = await addAddress(req.user.userId, req.body);
        return res.status(201).json({ message: "Address added successfully", data: address });
    } catch (error) {
        console.error("Error in addAddressController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while adding address"
        });
    }
};

export const getAddressController = async (req, res) => {
    try {
        const address = await getAddress(req.user.userId, req.params.addressId);
        return res.status(200).json({ message: "Address fetched successfully", data: address });
    } catch (error) {
        console.error("Error in getAddressController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while fetching address"
        });
    }
};

export const updateAddressController = async (req, res) => {
    try {
        const address = await updateAddress(req.user.userId, req.params.addressId, req.body);
        return res.status(200).json({ message: "Address updated successfully", data: address });
    } catch (error) {
        console.error("Error in updateAddressController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while updating address"
        });
    }
};

export const deleteAddressController = async (req, res) => {
    try {
        const result = await deleteAddress(req.user.userId, req.params.addressId);
        return res.status(200).json({ message: "Address deleted successfully", data: result });
    } catch (error) {
        console.error("Error in deleteAddressController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while deleting address"
        });
    }
};

export const setDefaultAddressController = async (req, res) => {
    try {
        const address = await setDefaultAddress(req.user.userId, req.params.addressId);
        return res.status(200).json({ message: "Default address updated successfully", data: address });
    } catch (error) {
        console.error("Error in setDefaultAddressController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while setting default address"
        });
    }
};

export default {
    getCustomerProfileController,
    updateCustomerProfileController,
    listAddressesController,
    addAddressController,
    getAddressController,
    updateAddressController,
    deleteAddressController,
    setDefaultAddressController
};

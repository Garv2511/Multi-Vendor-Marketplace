const ORDER_ID_REGEX = /^ORD-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const REQUIRED_DELIVERY_FIELDS = [
    "recipientName",
    "phone",
    "addressLine1",
    "city",
    "state",
    "postalCode",
    "country"
];

const MAX_DELIVERY_LENGTHS = {
    recipientName: 120,
    phone: 30,
    addressLine1: 200,
    addressLine2: 200,
    city: 100,
    state: 100,
    postalCode: 20,
    country: 100
};

const validateDeliveryAddress = (address) => {
    if (!address || typeof address !== "object" || Array.isArray(address)) {
        const error = new Error("deliveryAddress is required and must be an object");
        error.statusCode = 400;
        throw error;
    }

    const invalidKeys = Object.keys(address).filter((key) => (
        !REQUIRED_DELIVERY_FIELDS.includes(key) && key !== "addressLine2"
    ));
    if (invalidKeys.length > 0) {
        const error = new Error(`deliveryAddress contains unsupported fields: ${invalidKeys.join(", ")}`);
        error.statusCode = 400;
        throw error;
    }

    const normalized = {};

    for (const field of REQUIRED_DELIVERY_FIELDS) {
        const val = address[field];
        if (typeof val !== "string" || !val.trim()) {
            const error = new Error(`${field} is required`);
            error.statusCode = 400;
            throw error;
        }

        const trimmed = val.trim();
        if (trimmed.length > MAX_DELIVERY_LENGTHS[field]) {
            const error = new Error(`${field} exceeds maximum length of ${MAX_DELIVERY_LENGTHS[field]} characters`);
            error.statusCode = 400;
            throw error;
        }

        normalized[field] = trimmed;
    }

    if (address.addressLine2 !== undefined) {
        if (address.addressLine2 === null) {
            normalized.addressLine2 = null;
        } else if (typeof address.addressLine2 !== "string") {
            const error = new Error("addressLine2 must be a string");
            error.statusCode = 400;
            throw error;
        } else {
            const trimmed = address.addressLine2.trim();
            if (trimmed.length > MAX_DELIVERY_LENGTHS.addressLine2) {
                const error = new Error(`addressLine2 exceeds maximum length of ${MAX_DELIVERY_LENGTHS.addressLine2} characters`);
                error.statusCode = 400;
                throw error;
            }
            normalized.addressLine2 = trimmed || null;
        }
    } else {
        normalized.addressLine2 = null;
    }

    return normalized;
};

const toMinorUnits = (amountMajor) => {
    if (typeof amountMajor !== "number" || !Number.isFinite(amountMajor) || amountMajor < 0) {
        const error = new Error("price is invalid");
        error.statusCode = 400;
        throw error;
    }

    return Math.round(amountMajor * 100);
};

const fromMinorUnits = (amountMinor) => {
    if (typeof amountMinor !== "number" || !Number.isInteger(amountMinor) || amountMinor < 0) {
        return 0;
    }
    return Number((amountMinor / 100).toFixed(2));
};

const validateOrderId = (orderId) => {
    if (typeof orderId !== "string" || !ORDER_ID_REGEX.test(orderId)) {
        const error = new Error("Invalid order ID: format must be ORD-<UUID>");
        error.statusCode = 400;
        throw error;
    }
    return orderId;
};

export {
    ORDER_ID_REGEX,
    validateDeliveryAddress,
    toMinorUnits,
    fromMinorUnits,
    validateOrderId
};
export default {
    ORDER_ID_REGEX,
    validateDeliveryAddress,
    toMinorUnits,
    fromMinorUnits,
    validateOrderId
};


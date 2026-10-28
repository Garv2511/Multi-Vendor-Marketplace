const ADDRESS_FIELDS = [
    "recipientName",
    "phone",
    "addressLine1",
    "city",
    "state",
    "postalCode",
    "country"
];

const ADDRESS_LIMITS = {
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
        const error = new Error("A delivery address is required");
        error.statusCode = 400;
        throw error;
    }

    const normalized = {};
    for (const field of ADDRESS_FIELDS) {
        if (typeof address[field] !== "string" || !address[field].trim()) {
            const error = new Error(`${field} is required`);
            error.statusCode = 400;
            throw error;
        }
        const value = address[field].trim();
        if (value.length > ADDRESS_LIMITS[field]) {
            const error = new Error(`${field} exceeds the maximum length`);
            error.statusCode = 400;
            throw error;
        }
        normalized[field] = value;
    }

    if (address.addressLine2 !== undefined) {
        if (typeof address.addressLine2 !== "string") {
            const error = new Error("addressLine2 must be a string");
            error.statusCode = 400;
            throw error;
        }
        const value = address.addressLine2.trim();
        if (value.length > ADDRESS_LIMITS.addressLine2) {
            const error = new Error("addressLine2 exceeds the maximum length");
            error.statusCode = 400;
            throw error;
        }
        if (value) normalized.addressLine2 = value;
    }

    return normalized;
};

const toMinorUnits = (price) => {
    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
        const error = new Error("Product price is invalid");
        error.statusCode = 409;
        throw error;
    }
    return Math.round(price * 100);
};

const fromMinorUnits = (minorUnits) => minorUnits / 100;
const addressSnapshot = (address) => ({
    recipientName: address.recipientName,
    phone: address.phone,
    addressLine1: address.addressLine1,
    ...(address.addressLine2 ? { addressLine2: address.addressLine2 } : {}),
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country
});

const validateOrderId = (orderId) => {
    if (typeof orderId !== "string" || !/^ORD-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId)) {
        const error = new Error("Invalid order ID");
        error.statusCode = 400;
        throw error;
    }
    return orderId;
};

export {
    ADDRESS_FIELDS,
    validateDeliveryAddress,
    addressSnapshot,
    toMinorUnits,
    fromMinorUnits,
    validateOrderId
};

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
    country: 100,
    label: 40
};

const validateAddress = (input, { partial = false } = {}) => {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
        const error = new Error("Address data is required");
        error.statusCode = 400;
        throw error;
    }

    const fields = [...ADDRESS_FIELDS, "addressLine2", "label"];
    const normalized = {};
    for (const field of fields) {
        if (input[field] === undefined) {
            if (!partial && ADDRESS_FIELDS.includes(field)) {
                const error = new Error(`${field} is required`);
                error.statusCode = 400;
                throw error;
            }
            continue;
        }
        if (typeof input[field] !== "string") {
            const error = new Error(`${field} must be a string`);
            error.statusCode = 400;
            throw error;
        }
        const value = input[field].trim();
        if (!value && ADDRESS_FIELDS.includes(field)) {
            const error = new Error(`${field} must not be empty`);
            error.statusCode = 400;
            throw error;
        }
        if (value.length > ADDRESS_LIMITS[field]) {
            const error = new Error(`${field} exceeds the maximum length`);
            error.statusCode = 400;
            throw error;
        }
        if (value) normalized[field] = value;
    }
    return normalized;
};

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

export { ADDRESS_FIELDS, validateAddress, addressSnapshot };

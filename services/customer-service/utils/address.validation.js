const REQUIRED_FIELDS = [
    "recipientName",
    "phone",
    "addressLine1",
    "city",
    "state",
    "postalCode",
    "country"
];

const ALLOWED_FIELDS = new Set([
    ...REQUIRED_FIELDS,
    "addressLine2",
    "label",
    "isDefault"
]);

const MAX_LENGTHS = {
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

export const validateAddress = (data, { isUpdate = false } = {}) => {
    const rawKeys = Object.keys(data || {});
    const invalidKeys = rawKeys.filter((key) => !ALLOWED_FIELDS.has(key));
    if (invalidKeys.length > 0) {
        const error = new Error(`Protected or unknown address fields cannot be set: ${invalidKeys.join(", ")}`);
        error.statusCode = 400;
        throw error;
    }

    if (!isUpdate) {
        for (const field of REQUIRED_FIELDS) {
            const val = data?.[field];
            if (typeof val !== "string" || !val.trim()) {
                const error = new Error(`${field} is required and must be a non-empty string`);
                error.statusCode = 400;
                throw error;
            }
        }
    } else if (rawKeys.length === 0) {
        const error = new Error("At least one address field is required for update");
        error.statusCode = 400;
        throw error;
    }

    const normalized = {};

    for (const key of Object.keys(MAX_LENGTHS)) {
        if (data[key] !== undefined) {
            if (data[key] === null) {
                if (key === "addressLine2" || key === "label") {
                    normalized[key] = null;
                    continue;
                }
                const error = new Error(`${key} cannot be null`);
                error.statusCode = 400;
                throw error;
            }

            if (typeof data[key] !== "string") {
                const error = new Error(`${key} must be a string`);
                error.statusCode = 400;
                throw error;
            }

            const trimmed = data[key].trim();
            if (REQUIRED_FIELDS.includes(key) && !trimmed) {
                const error = new Error(`${key} cannot be empty`);
                error.statusCode = 400;
                throw error;
            }

            if (trimmed.length > MAX_LENGTHS[key]) {
                const error = new Error(`${key} exceeds maximum length of ${MAX_LENGTHS[key]} characters`);
                error.statusCode = 400;
                throw error;
            }

            normalized[key] = trimmed || null;
        }
    }

    if (data.isDefault !== undefined) {
        if (typeof data.isDefault !== "boolean") {
            const error = new Error("isDefault must be a boolean");
            error.statusCode = 400;
            throw error;
        }
        normalized.isDefault = data.isDefault;
    }

    return normalized;
};


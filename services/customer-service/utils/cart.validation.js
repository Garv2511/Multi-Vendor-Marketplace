const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;

const isValidProductIdInput = (productId) => typeof productId === "string" && productId.trim().length > 0;

export {
    isPositiveInteger,
    isValidProductIdInput
};
export default {
    isPositiveInteger,
    isValidProductIdInput
};


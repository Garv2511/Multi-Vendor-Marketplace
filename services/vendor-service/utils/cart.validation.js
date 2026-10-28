const isValidProductIdInput = (productId) => (
    typeof productId === "string" && productId.trim().length > 0
);

const isPositiveInteger = (quantity) => (
    typeof quantity === "number" && Number.isInteger(quantity) && quantity > 0
);

export { isValidProductIdInput, isPositiveInteger };

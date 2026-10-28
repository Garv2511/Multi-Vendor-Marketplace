const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

const parsePagination = (query) => {
    const page = query.page === undefined ? 1 : Number(query.page);
    const pageSize = query.pageSize === undefined ? DEFAULT_PAGE_SIZE : Number(query.pageSize);

    if (!Number.isInteger(page) || page < 1) {
        const error = new Error("page must be a positive integer");
        error.statusCode = 400;
        throw error;
    }
    if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE) {
        const error = new Error(`pageSize must be an integer between 1 and ${MAX_PAGE_SIZE}`);
        error.statusCode = 400;
        throw error;
    }

    return { page, pageSize };
};

export { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, parsePagination };

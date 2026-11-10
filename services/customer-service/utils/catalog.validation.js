const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

const parsePagination = ({ page = "1", pageSize = String(DEFAULT_PAGE_SIZE) }) => {
    const parsedPage = Number(page);
    const parsedPageSize = Number(pageSize);

    if (!Number.isInteger(parsedPage) || parsedPage <= 0) {
        const error = new Error("page must be a positive integer");
        error.statusCode = 400;
        throw error;
    }

    if (!Number.isInteger(parsedPageSize) || parsedPageSize <= 0 || parsedPageSize > MAX_PAGE_SIZE) {
        const error = new Error(`pageSize must be an integer between 1 and ${MAX_PAGE_SIZE}`);
        error.statusCode = 400;
        throw error;
    }

    return { page: parsedPage, pageSize: parsedPageSize };
};

export {
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    parsePagination
};
export default {
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    parsePagination
};


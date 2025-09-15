export interface PaginationParams {
    page: number;
    pageSize: number;
}

export interface PaginatedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export const DEFAULT_PAGINATION: PaginationParams = {
    page: 1,
    pageSize: 10
};

export function calculatePagination(
    totalCount: number,
    page: number,
    pageSize: number
): Omit<PaginatedResult<unknown>, 'items'> {
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
        totalCount,
        page,
        pageSize,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1
    };
} 
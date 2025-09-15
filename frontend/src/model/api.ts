
export interface ApiResponse<T> {
    data: T;
    status: number;
    ok: boolean;
}

export interface ApiError {
    message: string;
    code: string;
    details?: unknown;
}

export type ApiResult<T> = 
    | { success: true; data: T }
    | { success: false; error: ApiError };

export interface ApiRequestOptions {
    headers?: Record<string, string>;
    timeout?: number;
    credentials?: RequestCredentials;
}

export interface ApiResponseMetadata {
    timestamp: string;
    requestId: string;
    version: string;
} 
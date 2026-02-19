export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public details?: unknown,
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

interface FetchOptions {
  params?: Record<string, string | number | boolean>;
  next?: NextFetchRequestConfig;
  signal?: AbortSignal;
}

function getBaseUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';
}

export async function apiGet<T>(path: string, options?: FetchOptions): Promise<T> {
  const base = getBaseUrl();
  const url = new URL(path, base.endsWith('/') ? base : base + '/');

  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    next: options?.next,
    signal: options?.signal,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new ApiError(response.status, response.statusText, errorBody?.error);
  }

  const envelope: ApiEnvelope<T> = await response.json();

  if (!envelope.success) {
    throw new ApiError(400, 'API returned success: false', envelope.error);
  }

  return envelope.data;
}

export async function apiPost<T, B = unknown>(
  path: string,
  body: B,
  options?: FetchOptions,
): Promise<T> {
  const base = getBaseUrl();
  const url = new URL(path, base.endsWith('/') ? base : base + '/');

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: options?.signal,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new ApiError(response.status, response.statusText, errorBody?.error);
  }

  const envelope: ApiEnvelope<T> = await response.json();
  return envelope.data;
}

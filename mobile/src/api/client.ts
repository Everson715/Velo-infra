import { API_URL } from '../config';
import type { ApiError } from './types';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  token?: string | null;
};

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, token, headers, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await parseBody(response);

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? String((data as { message: unknown }).message)
        : typeof data === 'string'
          ? data
          : `HTTP ${response.status}`;

    const error: ApiError = { message, status: response.status };
    throw error;
  }

  return data as T;
}

export async function probeEndpoint(
  path: string,
): Promise<{ online: boolean; detail: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_URL}${path}`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.status === 502 || response.status === 503 || response.status === 504) {
      return { online: false, detail: `Gateway ${response.status}` };
    }

    const body = await response.text();
    const gatewayOffline =
      body.includes('microservice is offline') ||
      body.includes('The requested endpoint does not exist');

    if (response.status === 404 && gatewayOffline) {
      return { online: false, detail: 'Serviço indisponível' };
    }

    return { online: true, detail: `HTTP ${response.status}` };
  } catch (err) {
    const detail = err instanceof Error ? err.message : 'Erro de conexão';
    return { online: false, detail };
  }
}

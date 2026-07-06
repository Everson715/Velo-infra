import { apiRequest, probeEndpoint } from './client';
import type {
  AuthResponse,
  Estimate,
  EstimateRequest,
  Match,
  MatchRequest,
  Payment,
  PaymentRequest,
  Rating,
  RatingRequest,
  ServiceProbe,
  User,
} from './types';

export const GATEWAY_SERVICES = [
  { name: 'Identity & Driver', path: '/api/v1/me' },
  { name: 'Trip Matching', path: '/api/v1/routes' },
  { name: 'Tracking', path: '/tracking/' },
  { name: 'Payment', path: '/api/v1/payments' },
  { name: 'Review & Rating', path: '/api/v1/review' },
] as const;

function withAuth(token: string | null) {
  if (!token) throw { message: 'Faça login para continuar', status: 401 } as const;
  return token;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function getMe(token: string): Promise<User> {
  return apiRequest<User>('/api/v1/me', { token });
}

export async function createEstimate(
  token: string | null,
  payload: EstimateRequest,
): Promise<Estimate> {
  return apiRequest<Estimate>('/api/v1/estimates', {
    method: 'POST',
    token: withAuth(token),
    body: payload,
  });
}

export async function getPricing(
  token: string | null,
  distanceKm: number,
): Promise<Estimate> {
  return apiRequest<Estimate>(`/api/v1/pricing?distance_km=${distanceKm}`, {
    token: withAuth(token),
  });
}

export async function requestMatch(
  token: string | null,
  payload: MatchRequest,
): Promise<Match> {
  return apiRequest<Match>('/api/v1/match', {
    method: 'POST',
    token: withAuth(token),
    body: payload,
  });
}

export async function getMatch(
  token: string | null,
  matchId: string,
): Promise<Match> {
  return apiRequest<Match>(`/api/v1/match/${matchId}`, {
    token: withAuth(token),
  });
}

export async function createPayment(
  token: string | null,
  payload: PaymentRequest,
): Promise<Payment> {
  return apiRequest<Payment>('/api/v1/payments', {
    method: 'POST',
    token: withAuth(token),
    body: payload,
  });
}

export async function capturePayment(
  token: string | null,
  payload: PaymentRequest,
): Promise<Payment> {
  return apiRequest<Payment>('/api/v1/payments/capture', {
    method: 'POST',
    token: withAuth(token),
    body: payload,
  });
}

export async function submitRating(
  token: string | null,
  payload: RatingRequest,
): Promise<Rating> {
  return apiRequest<Rating>('/api/v1/rating', {
    method: 'POST',
    token: withAuth(token),
    body: payload,
  });
}

export async function submitReview(
  token: string | null,
  payload: RatingRequest,
): Promise<Rating> {
  return apiRequest<Rating>('/api/v1/review', {
    method: 'POST',
    token: withAuth(token),
    body: payload,
  });
}

export async function probeAllServices(): Promise<ServiceProbe[]> {
  return Promise.all(
    GATEWAY_SERVICES.map(async (service) => {
      const result = await probeEndpoint(service.path);
      return {
        name: service.name,
        path: service.path,
        status: result.online ? 'online' : 'offline',
        detail: result.detail,
      } satisfies ServiceProbe;
    }),
  );
}

export function formatApiError(err: unknown): string {
  if (typeof err === 'object' && err !== null && 'message' in err) {
    return String((err as { message: unknown }).message);
  }
  return 'Erro inesperado';
}

export function estimatePrice(estimate: Estimate): string {
  const value = estimate.price ?? estimate.amount;
  if (value == null) return '—';
  const currency = estimate.currency ?? 'BRL';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(Number(value));
}

export function estimateDuration(estimate: Estimate): string {
  const minutes = estimate.duration_minutes ?? estimate.duration;
  if (minutes == null) return '—';
  return `${minutes} min`;
}

export function estimateDistance(estimate: Estimate): string {
  const km = estimate.distance_km ?? estimate.distance;
  if (km == null) return '—';
  return `${Number(km).toFixed(1)} km`;
}

export function matchTripId(match: Match): string {
  return String(match.trip_id ?? match.id ?? '');
}

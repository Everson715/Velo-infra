export type ApiError = {
  message: string;
  status: number;
};

export type AuthResponse = {
  access_token: string;
  token_type?: string;
  expires_in?: number;
};

export type User = {
  id: number | string;
  name: string;
  email: string;
  [key: string]: unknown;
};

export type ServiceProbe = {
  name: string;
  path: string;
  status: 'online' | 'offline' | 'checking';
  detail?: string;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type EstimateRequest = {
  origin: Coordinates;
  destination: Coordinates;
  pickup_address?: string;
  dropoff_address?: string;
};

export type Estimate = {
  id?: string;
  price?: number;
  amount?: number;
  currency?: string;
  duration_minutes?: number;
  duration?: number;
  distance_km?: number;
  distance?: number;
  [key: string]: unknown;
};

export type MatchRequest = {
  estimate_id?: string;
  origin: Coordinates;
  destination: Coordinates;
  pickup_address?: string;
  dropoff_address?: string;
};

export type MatchStatus = 'searching' | 'matched' | 'in_progress' | 'completed' | 'cancelled';

export type Match = {
  id?: string;
  status?: MatchStatus | string;
  driver?: {
    name?: string;
    vehicle?: string;
    plate?: string;
    [key: string]: unknown;
  };
  trip_id?: string;
  [key: string]: unknown;
};

export type PaymentRequest = {
  trip_id: string;
  amount: number;
  method?: string;
  currency?: string;
};

export type Payment = {
  id?: string;
  status?: string;
  transaction_id?: string;
  [key: string]: unknown;
};

export type RatingRequest = {
  trip_id: string;
  rating: number;
  comment?: string;
};

export type Rating = {
  id?: string;
  status?: string;
  [key: string]: unknown;
};

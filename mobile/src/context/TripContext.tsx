import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Estimate, Match } from '../api/types';
import { estimatePrice, matchTripId } from '../api/services';

type TripContextValue = {
  estimate: Estimate | null;
  match: Match | null;
  tripId: string;
  amount: string;
  setEstimate: (estimate: Estimate | null) => void;
  setMatch: (match: Match | null) => void;
  setTripId: (id: string) => void;
  setAmount: (amount: string) => void;
  syncFromMatch: (match: Match, estimate?: Estimate | null) => void;
  clear: () => void;
};

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [tripId, setTripId] = useState('');
  const [amount, setAmount] = useState('');

  const syncFromMatch = useCallback((nextMatch: Match, nextEstimate?: Estimate | null) => {
    setMatch(nextMatch);
    const id = matchTripId(nextMatch);
    if (id) setTripId(id);
    const est = nextEstimate ?? estimate;
    if (est) {
      const price = est.price ?? est.amount;
      if (price != null) setAmount(String(price));
    }
  }, [estimate]);

  const clear = useCallback(() => {
    setEstimate(null);
    setMatch(null);
    setTripId('');
    setAmount('');
  }, []);

  const value = useMemo(
    () => ({
      estimate,
      match,
      tripId,
      amount,
      setEstimate,
      setMatch,
      setTripId,
      setAmount,
      syncFromMatch,
      clear,
    }),
    [estimate, match, tripId, amount, syncFromMatch, clear],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrip must be used within TripProvider');
  return ctx;
}

export function useTripSummary() {
  const { estimate, match } = useTrip();
  return {
    hasEstimate: estimate != null,
    hasMatch: match != null,
    priceLabel: estimate ? estimatePrice(estimate) : '—',
    matchStatus: match?.status ? String(match.status) : '—',
  };
}

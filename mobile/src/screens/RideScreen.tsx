import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  createEstimate,
  estimateDistance,
  estimateDuration,
  estimatePrice,
  formatApiError,
  requestMatch,
} from '../api/services';
import type { Coordinates } from '../api/types';
import {
  AuthGate,
  Field,
  InfoRow,
  PrimaryButton,
  ScreenHeader,
  SecondaryButton,
} from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { colors, shared } from '../styles/theme';

type Step = 'form' | 'estimate' | 'match';

const DEFAULT_ORIGIN = { lat: '-23.5505', lng: '-46.6333' };
const DEFAULT_DEST = { lat: '-23.5614', lng: '-46.6558' };

function parseCoord(value: string): number | null {
  const n = Number(value.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function buildCoords(lat: string, lng: string): Coordinates | null {
  const parsedLat = parseCoord(lat);
  const parsedLng = parseCoord(lng);
  if (parsedLat == null || parsedLng == null) return null;
  return { lat: parsedLat, lng: parsedLng };
}

export function RideScreen() {
  const { token } = useAuth();
  const { estimate, match, setEstimate, syncFromMatch, clear } = useTrip();

  const [step, setStep] = useState<Step>(estimate ? 'estimate' : 'form');
  const [originLat, setOriginLat] = useState(DEFAULT_ORIGIN.lat);
  const [originLng, setOriginLng] = useState(DEFAULT_ORIGIN.lng);
  const [destLat, setDestLat] = useState(DEFAULT_DEST.lat);
  const [destLng, setDestLng] = useState(DEFAULT_DEST.lng);
  const [pickup, setPickup] = useState('Av. Paulista, São Paulo');
  const [dropoff, setDropoff] = useState('Rua Augusta, São Paulo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEstimate() {
    const origin = buildCoords(originLat, originLng);
    const destination = buildCoords(destLat, destLng);
    if (!origin || !destination) {
      setError('Informe coordenadas válidas (lat/lng)');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await createEstimate(token, {
        origin,
        destination,
        pickup_address: pickup.trim() || undefined,
        dropoff_address: dropoff.trim() || undefined,
      });
      setEstimate(result);
      setStep('estimate');
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleMatch() {
    if (!estimate) return;
    const origin = buildCoords(originLat, originLng);
    const destination = buildCoords(destLat, destLng);
    if (!origin || !destination) {
      setError('Coordenadas inválidas');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await requestMatch(token, {
        estimate_id: estimate.id ? String(estimate.id) : undefined,
        origin,
        destination,
        pickup_address: pickup.trim() || undefined,
        dropoff_address: dropoff.trim() || undefined,
      });
      syncFromMatch(result, estimate);
      setStep('match');
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    clear();
    setStep('form');
    setError(null);
  }

  return (
    <AuthGate token={token}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={shared.scrollContent}>
          <ScreenHeader
            title="Corrida"
            subtitle="POST /api/v1/estimates → POST /api/v1/match"
          />

          {step === 'form' && (
            <View style={styles.section}>
              <Text style={styles.stepLabel}>1. Origem e destino</Text>
              <Field label="Endereço de partida" value={pickup} onChangeText={setPickup} />
              <Field
                label="Latitude origem"
                value={originLat}
                onChangeText={setOriginLat}
                keyboardType="decimal-pad"
              />
              <Field
                label="Longitude origem"
                value={originLng}
                onChangeText={setOriginLng}
                keyboardType="decimal-pad"
              />
              <Field label="Endereço de destino" value={dropoff} onChangeText={setDropoff} />
              <Field
                label="Latitude destino"
                value={destLat}
                onChangeText={setDestLat}
                keyboardType="decimal-pad"
              />
              <Field
                label="Longitude destino"
                value={destLng}
                onChangeText={setDestLng}
                keyboardType="decimal-pad"
              />
              {error ? <Text style={shared.error}>{error}</Text> : null}
              <PrimaryButton
                label="Calcular estimativa"
                onPress={handleEstimate}
                loading={loading}
              />
            </View>
          )}

          {step === 'estimate' && estimate && (
            <View style={styles.section}>
              <Text style={styles.stepLabel}>2. Estimativa</Text>
              <View style={shared.card}>
                <InfoRow label="Preço" value={estimatePrice(estimate)} />
                <InfoRow label="Duração" value={estimateDuration(estimate)} />
                <InfoRow label="Distância" value={estimateDistance(estimate)} />
                {estimate.id != null ? (
                  <InfoRow label="ID" value={String(estimate.id)} />
                ) : null}
              </View>
              {error ? <Text style={shared.error}>{error}</Text> : null}
              <PrimaryButton
                label="Solicitar motorista"
                onPress={handleMatch}
                loading={loading}
              />
              <SecondaryButton label="Nova estimativa" onPress={() => setStep('form')} />
            </View>
          )}

          {step === 'match' && match && (
            <View style={styles.section}>
              <Text style={styles.stepLabel}>3. Match</Text>
              <View style={shared.card}>
                <InfoRow
                  label="Status"
                  value={match.status ? String(match.status) : 'searching'}
                />
                {match.id != null ? (
                  <InfoRow label="Match ID" value={String(match.id)} />
                ) : null}
                {match.trip_id != null ? (
                  <InfoRow label="Trip ID" value={String(match.trip_id)} />
                ) : null}
                {match.driver?.name ? (
                  <InfoRow label="Motorista" value={String(match.driver.name)} />
                ) : null}
                {match.driver?.vehicle ? (
                  <InfoRow label="Veículo" value={String(match.driver.vehicle)} />
                ) : null}
              </View>
              <Text style={styles.hint}>
                Vá para Pagamento para finalizar o trip_id acima.
              </Text>
              <SecondaryButton label="Nova corrida" onPress={handleReset} />
            </View>
          )}

          {loading && step !== 'form' ? (
            <ActivityIndicator color={colors.primary} style={styles.loader} />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthGate>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  section: { gap: 4 },
  stepLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 12,
    textAlign: 'center',
  },
  loader: { marginTop: 16 },
});

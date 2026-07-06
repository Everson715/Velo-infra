const { apiClient, generateCorrelationId } = require('../utils/apiClient');

describe('API Gateway Routing: Trip Matching Service', () => {
  const serviceBaseUrl = '/api/v1/trips';

  it('should route POST /trips/request correctly', async () => {
    const correlationId = generateCorrelationId();
    const response = await apiClient.post(`${serviceBaseUrl}/request`, {
      passengerId: "pax_123",
      origin: "Av Paulista, 1000",
      destination: "Ibirapuera Park"
    }, {
      headers: { 'X-Correlation-ID': correlationId, 'Authorization': 'Bearer test-token' }
    });

    expect(response.status).not.toBe(404);
    expect(response.headers['x-correlation-id']).toEqual(correlationId);
  });

  it('should route GET /trips/:id/status correctly', async () => {
    const response = await apiClient.get(`${serviceBaseUrl}/trip_888/status`, {
        headers: { 'Authorization': 'Bearer test-token' }
    });
    expect(response.status).not.toBe(404);
  });

  it('should return 401 if trying to request a trip without auth token', async () => {
    const response = await apiClient.post(`${serviceBaseUrl}/request`, {
        origin: "A",
        destination: "B"
    });
    expect([401, 403]).toContain(response.status);
  });
});

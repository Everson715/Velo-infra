const { apiClient, generateCorrelationId } = require('../utils/apiClient');

describe('API Gateway Routing: Tracking & Telemetry Service', () => {
  const serviceBaseUrl = '/api/v1/telemetry';

  it('should route POST /telemetry/location correctly', async () => {
    const correlationId = generateCorrelationId();
    const response = await apiClient.post(`${serviceBaseUrl}/location`, {
      driverId: "drv_123",
      lat: -23.5505,
      lng: -46.6333
    }, {
      headers: { 'X-Correlation-ID': correlationId }
    });

    expect(response.status).not.toBe(404);
    expect(response.headers['x-correlation-id']).toEqual(correlationId);
  });

  it('should route GET /telemetry/stream and support upgrades (returns 426 or expected status)', async () => {
    const response = await apiClient.get(`${serviceBaseUrl}/stream`, {
        headers: {
            'Connection': 'Upgrade',
            'Upgrade': 'websocket'
        }
    });
    // If WebSocket upgrade is missing required WS headers, it might return 400 or 426
    expect([101, 400, 426]).toContain(response.status);
  });

  it('should return 404 for global undefined routes', async () => {
    const response = await apiClient.get(`/invalid-path-entirely`);
    expect(response.status).toBe(404);
    // Verifying Nginx default 404 JSON response
    expect(response.data.error).toBe("Not Found");
  });
});

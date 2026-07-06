const { apiClient, generateCorrelationId } = require('../utils/apiClient');

describe('API Gateway Routing: Review & Rating Service', () => {
  const serviceBaseUrl = '/api/v1/reviews';

  it('should route POST /reviews successfully with correlation ID', async () => {
    const correlationId = generateCorrelationId();
    const response = await apiClient.post(serviceBaseUrl, {
      tripId: "trip_123",
      rating: 5,
      comment: "Great ride!"
    }, {
      headers: { 'X-Correlation-ID': correlationId, 'Authorization': 'Bearer test-token' }
    });

    expect(response.status).not.toBe(404);
    expect(response.headers['x-correlation-id']).toEqual(correlationId);
  });

  it('should route GET /reviews/trip/:id successfully', async () => {
    const response = await apiClient.get(`${serviceBaseUrl}/trip/trip_123`, {
        headers: { 'Authorization': 'Bearer test-token' }
    });
    expect(response.status).not.toBe(404);
  });

  it('should return 400 or 401 for submitting a review without auth', async () => {
    const response = await apiClient.post(serviceBaseUrl, {
        tripId: "trip_123",
        rating: 4
    });
    expect([401, 403]).toContain(response.status);
  });
});

const { apiClient, generateCorrelationId } = require('../utils/apiClient');

describe('API Gateway Routing: Payment & Finance Service', () => {
  const serviceBaseUrl = '/api/v1/payments';

  it('should route POST /payments/authorize and handle Correlation-ID', async () => {
    const correlationId = generateCorrelationId();
    const response = await apiClient.post(`${serviceBaseUrl}/authorize`, {
      amount: 15.50,
      paymentMethodId: "pm_123"
    }, {
      headers: { 'X-Correlation-ID': correlationId, 'Authorization': 'Bearer test-token' }
    });

    expect(response.status).not.toBe(404);
    expect(response.headers['x-correlation-id']).toEqual(correlationId);
  });

  it('should route GET /payments/wallets/me and return 401/403 without valid token', async () => {
    const response = await apiClient.get(`/api/v1/wallets/me`);
    // Depending on security setup, should be blocked or processed
    expect([401, 403]).toContain(response.status);
  });

  it('should route POST /payments/capture successfully', async () => {
    const response = await apiClient.post(`${serviceBaseUrl}/capture`, {
        transactionId: "txn_890"
    }, {
        headers: { 'Authorization': 'Bearer test-token' }
    });
    expect(response.status).not.toBe(404);
  });
});

const { apiClient, generateCorrelationId } = require('../utils/apiClient');

describe('API Gateway Routing: Identity & Driver Service', () => {
  const serviceBaseUrl = '/api/v1';

  it('should route POST /auth/login successfully and return X-Correlation-ID', async () => {
    const correlationId = generateCorrelationId();
    const response = await apiClient.post(`${serviceBaseUrl}/auth/login`, {
        email: "driver@velo.com",
        password: "password"
    }, {
      headers: { 'X-Correlation-ID': correlationId }
    });

    // 200/201 indicates it routed successfully to the underlying service (assuming it's up, or returns a 401 if missing credentials in the mock)
    // For Gateway tests, we mostly care about it NOT being 404 from Nginx, or matching specific headers
    expect(response.status).not.toBe(404);
    
    // Verifying Nginx is returning the correlation ID
    expect(response.headers['x-correlation-id']).toBeDefined();
    if(response.headers['x-correlation-id']) {
        expect(response.headers['x-correlation-id']).toEqual(correlationId);
    }
  });

  it('should route GET /users/me and return 401 Unauthorized if no token', async () => {
    const response = await apiClient.get(`${serviceBaseUrl}/users/me`);
    expect(response.status).toBe(401);
  });

  it('should return 404 for non-existent route within the service path', async () => {
    const response = await apiClient.get(`${serviceBaseUrl}/auth/this-does-not-exist`);
    // Assuming the microservice returns 404 for its own missing routes
    expect(response.status).toBe(404); 
  });
});

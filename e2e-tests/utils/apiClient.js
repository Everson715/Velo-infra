const axios = require('axios');
const { v4: uuidv4 } = require('uuid'); // We would use uuid but let's just generate a random string for simplicity to avoid adding another dep
// Or better, since we don't have uuid installed, we'll just use a simple function:

const generateCorrelationId = () => `test-req-${Math.random().toString(36).substring(2, 15)}`;

// Setup Axios default instance pointing to the API Gateway
const gatewayUrl = process.env.GATEWAY_URL || 'http://localhost:80';

const apiClient = axios.create({
  baseURL: gatewayUrl,
  validateStatus: () => true // Resolve promise for all status codes so we can test them without try/catch
});

module.exports = {
  apiClient,
  generateCorrelationId,
  gatewayUrl
};

import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export const options = {
  scenarios: {
    load_test: {
      executor: 'ramping-vus',
      stages: [
        { duration: '10s', target: 50 },  // Ramp up to 50 VUs over 10s
        { duration: '50s', target: 100 }, // Ramp up to 100 VUs over 50s
        { duration: '10s', target: 0 },   // Ramp down to 0 VUs over 10s
      ],
      gracefulRampDown: '5s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.1'],    // Error rate should be below 10%
  },
};

// Base URL and headers
const BASE_URL = 'http://localhost:3000';
const HEADERS = {
  'Authorization': '5f79d493-680f-427c-aba2-3ff6bad8dfb3',
};

export default function () {
  // Make GET request to the API endpoint
  const response = http.get(`${BASE_URL}/api/hello`, {
    headers: HEADERS,
  });

  // Validate the response
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
    'response has body': (r) => r.body && r.body.length > 0,
  });

  // Optional: Log response for debugging (remove in production tests)
  if (response.status !== 200) {
    console.error(`Request failed with status ${response.status}: ${response.body}`);
  }

  // Small delay between requests (adjust as needed)
  // sleep(1);
}

// Setup function (runs once before the test)
export function setup() {
  console.log('Starting K6 load test...');
  console.log('Target endpoint: http://localhost:3000/api/hello');
  console.log('Load pattern: 10s->50VU, 50s->100VU, 10s->0VU');
}

// Teardown function (runs once after the test)
export function teardown() {
  console.log('K6 load test completed!');
}
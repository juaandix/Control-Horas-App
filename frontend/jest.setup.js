jest.mock('./src/services/api.js', () => require('./src/services/api.mock.js'));
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.import = {};
global.import.meta = { env: { VITE_API_URL: 'http://localhost:5001/api' } };

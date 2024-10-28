// jest.setup.js
import '@testing-library/jest-dom';
jest.mock('@/lib/supabase/client', () => require('@/__mocks__/supabaseClient.js'));
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
require('jest-fetch-mock').enableMocks();

fetch.mockResponse(JSON.stringify({ data: [] }));
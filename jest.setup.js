// jest.setup.js
import '@testing-library/jest-dom';
jest.mock('@/lib/supabase/client', () => require('@/__mocks__/supabaseClient.js'));
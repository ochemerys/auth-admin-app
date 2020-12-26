/* eslint-disable no-undef */
import Auth from '@/services/firebase-auth-lite';

jest.genMockFromModule('@/services/firebase-auth-lite');
jest.mock('@/services/firebase-auth-lite');

export default function authMock() {
  const mockFirebaseAuth = {};

  Auth.mockImplementation(() => mockFirebaseAuth);

  return mockFirebaseAuth;
}

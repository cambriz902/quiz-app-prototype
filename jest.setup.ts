import '@testing-library/jest-dom';
import 'openai/shims/node';
import fetch, { Headers, Request, Response } from 'node-fetch';
import { jest } from '@jest/globals';

// Silence console.error in tests
jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock next-auth with explicit promise
jest.mock('next-auth/react', () => ({
  signIn: jest.fn().mockImplementation(() => 
    Promise.resolve({ 
      ok: true,
      error: null,
      status: 200,
      url: null 
    })
  ),
  signOut: jest.fn(),
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
}));

// Mock auth options
jest.mock('@/api/auth/[...nextauth]/route', () => ({
  authOptions: {}
}));

// Mock Prisma globally
jest.mock('@/lib/prisma', () => ({
  prisma: {
    quiz: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    question: {
      createMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    }
  },
}));

// Mock getSessionUserId before any imports use it
jest.mock('@/lib/auth', () => ({
  getSessionUserId: jest.fn(() => Promise.resolve(123)),
}));

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
})) as unknown as typeof ResizeObserver;

global.fetch = fetch as unknown as typeof global.fetch;
global.Headers = Headers as unknown as typeof global.Headers;
global.Request = Request as unknown as typeof global.Request;
global.Response = Response as unknown as typeof global.Response;
global.AbortSignal = AbortSignal;

// Create a single instance of the mock router
const mockRouter = {
  push: jest.fn().mockImplementation(() => {}),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  replace: jest.fn(),
};

// Mock next/navigation to return the same instance
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,  // Return same instance every time
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}));

// Export the mockRouter for tests that need to access it
export { mockRouter };

import '@testing-library/jest-dom';
import 'openai/shims/node';
import fetch, { Headers, Request, Response } from 'node-fetch';
import { jest } from '@jest/globals';

// Silence console.error in tests
jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock next-auth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(() => null)
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

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '',
}));

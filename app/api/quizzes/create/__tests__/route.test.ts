// import 'openai/shims/node';
import { POST } from '../route'
import { generateQuiz } from '@/lib/services/openaiService'
import { createQuizFromOpenAI } from '@/lib/db/quizService'
import { NextRequest } from 'next/server'

// Mock NextResponse
jest.mock('next/server', () => ({
  NextRequest: jest.requireActual('next/server').NextRequest,
  NextResponse: {
    json: (data: any, init?: ResponseInit) => {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: { 'content-type': 'application/json', ...init?.headers },
      })
    },
  },
}))

// Mock dependencies
jest.mock('@/lib/services/openaiService')
jest.mock('@/lib/db/quizService')

describe('POST /api/quizzes/create', () => {
  const mockQuizId = 123
  const validRequest = {
    topic: 'World War II',
    numMultipleChoiceQuestions: 5,
    numFreeResponseQuestions: 1,
  }

  beforeEach(() => {
    jest.resetAllMocks();
    // Mock successful quiz creation with more specific data
    (generateQuiz as jest.Mock).mockResolvedValue({ 
      questions: [],
      topic: validRequest.topic 
    });
    (createQuizFromOpenAI as jest.Mock).mockResolvedValue({ id: mockQuizId });
  });

  const createRequest = (body: any) => {
    return new NextRequest(
      new Request('http://localhost/api/quizzes/create', {
        method: 'POST',
        body: JSON.stringify(body)
      })
    );
  }

  describe('validation', () => {
    it('returns error for missing topic', async () => {
      const requestWithoutTopic = {
        numMultipleChoiceQuestions: validRequest.numMultipleChoiceQuestions,
        numFreeResponseQuestions: validRequest.numFreeResponseQuestions,
      }
      const response = await POST(createRequest(requestWithoutTopic));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Topic is required');
    });

    it('returns error for missing question counts', async () => {
      const response = await POST(createRequest({ topic: validRequest.topic }));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Question counts are required');
    });

    it('returns error for invalid question counts', async () => {
      const testCases = [
        {
          input: { ...validRequest, numMultipleChoiceQuestions: 15 },
          expectedError: 'Maximum 10 multiple choice questions allowed'
        },
        {
          input: { ...validRequest, numFreeResponseQuestions: 3 },
          expectedError: 'Maximum 2 free response questions allowed'
        },
        {
          input: { ...validRequest, numMultipleChoiceQuestions: -1 },
          expectedError: 'Question counts cannot be negative'
        }
      ];

      for (const { input, expectedError } of testCases) {
        const response = await POST(createRequest(input));
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe(expectedError);
      }
    });
  });

  describe('successful creation', () => {
    it('creates a quiz with valid input', async () => {
      const response = await POST(createRequest(validRequest));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ quizId: mockQuizId });
      expect(generateQuiz).toHaveBeenCalledWith(
        validRequest.topic,
        validRequest.numMultipleChoiceQuestions,
        validRequest.numFreeResponseQuestions
      );
        expect(createQuizFromOpenAI).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('handles service errors gracefully', async () => {
      (generateQuiz as jest.Mock).mockRejectedValue(new Error('Service error'));
      
      const response = await POST(createRequest(validRequest));
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to process request');
    });
  });
}); 
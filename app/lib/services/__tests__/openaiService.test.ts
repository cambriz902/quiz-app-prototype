import 'openai/shims/node';
import { generateQuiz } from '../openaiService';
import OpenAI from 'openai';

jest.mock('openai', () => {
  const mockCreate = jest.fn().mockResolvedValue({
    choices: [{
      message: {
        content: JSON.stringify({
          title: "JavaScript Basics",
          description: "Test your JavaScript knowledge",
          questions: [
            {
              type: "multiple_choice",
              text: "What is JavaScript?",
              referenceText: "JavaScript is a programming language",
              multipleChoiceOptions: [
                { text: "A programming language", isCorrect: true },
                { text: "A markup language", isCorrect: false },
                { text: "A styling language", isCorrect: false },
                { text: "A database", isCorrect: false }
              ]
            }
          ]
        })
      }
    }]
  });

  const MockOpenAI = jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate
      }
    }
  }));

  return {
    __esModule: true,
    default: MockOpenAI,
    OpenAI: MockOpenAI
  };
});

describe('openaiService', () => {

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks(); 
  });

  it('generates a quiz successfully', async () => {
    const quiz = await generateQuiz('JavaScript', 1, 0);
    
    expect(quiz).toBeDefined();
    expect(quiz.title).toBe('JavaScript Basics');
    expect(quiz.questions).toHaveLength(1);
    expect(quiz.questions[0].type).toBe('multiple_choice');
  });

  it('calls OpenAI with correct parameters', async () => {
    await generateQuiz('JavaScript', 2, 1);
    
    const mockCreate = (new OpenAI().chat.completions.create) as jest.Mock;
    const createCall = mockCreate.mock.calls[0][0];

    expect(createCall.model).toBe('gpt-4o-mini');
    expect(createCall.messages).toHaveLength(2);
    expect(createCall.messages[0].role).toBe('system');
    expect(createCall.messages[1].role).toBe('user');
    expect(JSON.parse(createCall.messages[1].content)).toEqual({
      topic: 'JavaScript',
      numMultipleChoiceQuestions: 2,
      numFreeResponseQuestions: 1,
    });
  });

  it('throws error when OpenAI returns null content', async () => {
    const mockOpenAI = new OpenAI({ apiKey: 'test-key' });
    mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
      choices: [{ message: { content: null } }]
    });

    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => mockOpenAI);

    await expect(generateQuiz('JavaScript', 1, 0))
      .rejects
      .toThrow('Response content is null');
  });

  it('throws error when OpenAI request fails', async () => {
    const mockOpenAI = new OpenAI({ apiKey: 'test-key' });
    mockOpenAI.chat.completions.create = jest.fn().mockRejectedValue(
      new Error('API Error')
    );

    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => mockOpenAI);

    await expect(generateQuiz('JavaScript', 1, 0))
      .rejects
      .toThrow('API Error');
  });
}); 
import OpenAI from 'openai';
import { checkFreeResponseAnswer, generateQuiz } from '../openaiService';
import openAIClient from '@/lib/services/openAIClient';

// import OpenAI from 'openai';

// jest.mock('openai', () => {
//   return {
//     __esModule: true,
//     default: jest.fn().mockImplementation(() => ({})),
//     OpenAI: jest.fn().mockResolvedValue({})
//   };
// });

describe('generateQuiz', () => {
  const mockOpenAIResponse = {
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
  }
  beforeEach(() => {
    (openAIClient.chat.completions.create as jest.Mock).mockClear();
  });

  it('generates a quiz successfully', async () => {
    openAIClient.chat.completions.create.mockResolvedValueOnce(mockOpenAIResponse);

    const quiz = await generateQuiz('JavaScript', 1, 0);
    
    expect(quiz).toBeDefined();
    expect(quiz.title).toBe('JavaScript Basics');
    expect(quiz.questions).toHaveLength(1);
    expect(quiz.questions[0].type).toBe('multiple_choice');
  });

  it('calls OpenAI with correct parameters', async () => {
    openAIClient.chat.completions.create.mockResolvedValueOnce(mockOpenAIResponse);

    await generateQuiz('JavaScript', 2, 1);
    const createCall = openAIClient.chat.completions.create.mock.calls[0][0];

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
    openAIClient.chat.completions.create.mockResolvedValueOnce({
      choices: [{ message: { content: null } }]
    });

    await expect(generateQuiz('JavaScript', 1, 0))
      .rejects
      .toThrow('Response content is null');
  });

  it('throws error when OpenAI request fails', async () => {
    openAIClient.chat.completions.create = jest.fn().mockRejectedValue(
      new Error('API Error')
    );

    await expect(generateQuiz('JavaScript', 1, 0))
      .rejects
      .toThrow('API Error');
  });
});

describe('checkFreeResponseAnswer', () => {
  const mockOpenAIResponse = {
    choices: [{
      message: {
        content: JSON.stringify({
          isCorrect: true,
          feedback: "Good answer! Consider adding more detail about X."
        })
      }
    }]
  };

  beforeEach(() => {
    (openAIClient.chat.completions.create as jest.Mock).mockClear();
  });

  it('calls OpenAI with correct parameters', async () => {
    openAIClient.chat.completions.create.mockResolvedValueOnce(mockOpenAIResponse);

    await checkFreeResponseAnswer(
      "Test answer",
      "What is X?",
      "X is a concept that..."
    );

    expect(openAIClient.chat.completions.create).toHaveBeenCalledWith(expect.objectContaining({
      model: "gpt-4o-mini",
      messages: expect.arrayContaining([
        {
          role: "system",
          content: expect.stringContaining("AI tutor grading")
        },
        {
          role: "user",
          content: expect.stringContaining("Test answer")
        }
      ])
    }));
  });

  it('returns parsed response when successful', async () => {
    openAIClient.chat.completions.create.mockResolvedValueOnce(mockOpenAIResponse);

    const result = await checkFreeResponseAnswer(
      "Test answer",
      "What is X?",
      "X is a concept that..."
    );

    expect(result).toEqual({
      isCorrect: true,
      feedback: "Good answer! Consider adding more detail about X."
    });
  });

  it('throws error when response content is null', async () => {
    openAIClient.chat.completions.create.mockResolvedValueOnce({
      choices: [{ message: { content: null } }]
    });

    await expect(checkFreeResponseAnswer(
      "Test answer",
      "What is X?",
      "X is a concept that..."
    )).rejects.toThrow('Response content is null');
  });

  it('throws error when response content is null', async () => {
    openAIClient.chat.completions.create.mockResolvedValueOnce({
      choices: [{ message: { content: null } }]
    });

    await expect(checkFreeResponseAnswer(
      "Test answer",
      "What is X?",
      "X is a concept that..."
    )).rejects.toThrow('Response content is null');
  });
}); 
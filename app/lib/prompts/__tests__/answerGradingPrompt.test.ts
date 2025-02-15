import { getAnswerGradingPrompt } from '../answerGradingPrompt';

describe('getAnswerGradingPrompt', () => {
  const prompt = getAnswerGradingPrompt();

  it('includes input format specification', () => {
    expect(prompt).toContain('"question": string');
    expect(prompt).toContain('"context": string');
    expect(prompt).toContain('"answer": string');
  });

  it('includes response format specification', () => {
    expect(prompt).toContain('"isCorrect": boolean');
    expect(prompt).toContain('"feedback": string');
  });

  it('includes grading guidelines', () => {
    expect(prompt).toContain('Grade with leniency');
    expect(prompt).toContain('focus on understanding over exact wording');
    expect(prompt).toContain('partially correct answers');
  });

  it('includes example input and response', () => {
    expect(prompt).toContain('Example:');
    expect(prompt).toContain('Input:');
    expect(prompt).toContain('Response:');
    expect(prompt).toContain('for loop');
  });

  it('emphasizes using reference text', () => {
    expect(prompt).toContain('using provided reference text as the source of truth');
  });
}); 
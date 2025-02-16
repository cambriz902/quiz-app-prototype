import { getQuizCreationPrompt } from '../quizCreationPrompt';

describe('getQuizCreationPrompt', () => {
  const prompt = getQuizCreationPrompt();

  it('includes input format specification', () => {
    expect(prompt).toContain('"topic": string');
    expect(prompt).toContain('"numMultipleChoiceQuestions": number');
    expect(prompt).toContain('"numFreeResponseQuestions": number');
  });

  it('includes multiple choice question requirements', () => {
    expect(prompt).toContain('Provide exactly 4 options');
    expect(prompt).toContain('EXACTLY ONE option is marked as correct');
    expect(prompt).toContain('Make distractors (wrong answers) plausible');
  });

  it('includes reference text requirements', () => {
    expect(prompt).toContain('reference text');
    expect(prompt).toContain('detailed explanation of why the correct answer is right');
    expect(prompt).toContain('evaluate student answers using RAG');
  });

  it('specifies response format', () => {
    expect(prompt).toContain('"title": string');
    expect(prompt).toContain('"description": string');
    expect(prompt).toContain('"questions": Question[]');
  });
}); 
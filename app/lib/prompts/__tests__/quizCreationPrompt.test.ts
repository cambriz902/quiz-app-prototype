import { getQuizCreationPrompt } from '../quizCreationPrompt';

describe('getQuizCreationPrompt', () => {
  it('includes the correct number of multiple choice questions', () => {
    const prompt = getQuizCreationPrompt(3, 2, 'JavaScript');
    expect(prompt).toContain('3 multiple choice questions');
  });

  it('includes the correct number of free response questions', () => {
    const prompt = getQuizCreationPrompt(3, 2, 'JavaScript');
    expect(prompt).toContain('2 free response questions');
  });

  it('includes the specified topic', () => {
    const prompt = getQuizCreationPrompt(3, 2, 'JavaScript');
    expect(prompt).toContain('about JavaScript');
  });

  it('includes instructions for multiple choice questions', () => {
    const prompt = getQuizCreationPrompt(1, 1, 'Python');
    expect(prompt).toContain('Provide exactly 4 options');
    expect(prompt).toContain('EXACTLY ONE option is marked as correct');
    expect(prompt).toContain('Make distractors (wrong answers) plausible');
  });

  it('includes instructions about reference text', () => {
    const prompt = getQuizCreationPrompt(1, 1, 'Python');
    expect(prompt).toContain('reference text');
    expect(prompt).toContain('For multiple choice questions: Provides a detailed explanation');
    expect(prompt).toContain('For free response questions: Contains comprehensive reference information');
  });

  it('handles zero questions gracefully', () => {
    const prompt = getQuizCreationPrompt(0, 0, 'React');
    expect(prompt).toContain('0 multiple choice questions');
    expect(prompt).toContain('0 free response questions');
  });
}); 
export const getQuizCreationPrompt = (
  numMultipleChoiceQuestions: number,
  numFreeResponseQuestions: number,
  topic: string
) => `You are an AI teacher creating a quiz. Create a quiz with ${numMultipleChoiceQuestions} multiple choice questions 
  and ${numFreeResponseQuestions} free response questions about ${topic}.

  For each question, provide:
  1. The question text
  2. A reference text that serves two purposes:
     - For multiple choice questions: Provides a detailed explanation of why the correct answer is right and why the other options are wrong
     - For free response questions: Contains comprehensive reference information that will be used to evaluate student answers using RAG (Retrieval Augmented Generation)
  
  For multiple choice questions:
  - Provide exactly 4 options
  - Ensure EXACTLY ONE option is marked as correct (isCorrect: true)
  - Make distractors (wrong answers) plausible but clearly incorrect`; 
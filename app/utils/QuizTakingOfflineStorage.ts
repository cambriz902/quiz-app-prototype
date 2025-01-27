"use client";

class QuizTakingOfflineStorage {
  private static STORAGE_KEY = "rize_quiz_taking_offline_answers";

  // ✅ Store a single answer in local storage
  static saveAnswer(answer: { questionId: number; selectedAnswer: number | string; attemptId: number }) {
    const answers = this.getPendingAnswers();
    answers.push(answer);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(answers));
  }

  // ✅ Get all pending answers
  static getPendingAnswers() {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
  }

  // ✅ Sync answers one by one
  static async syncAnswers() {
    const pendingAnswers = this.getPendingAnswers();
    if (!pendingAnswers.length) return;
  
    for (const answer of pendingAnswers) {
      try {
        await fetch(`/api/quizzes/${answer.quizId}/questions/${answer.questionId}/answer`, {
          method: "POST",
          body: JSON.stringify({ attemptId: answer.attemptId, selectedAnswer: answer.selectedAnswer }),
          headers: { "Content-Type": "application/json" },
        });
        this.removeSyncedAnswer(answer.questionId);
      } catch (error) {
        console.error("Failed to sync answer:", error);
      }
    }
  }

  // ✅ Remove a synced answer from local storage
  private static removeSyncedAnswer(questionId: number) {
    const answers = this.getPendingAnswers().filter((a) => a.questionId !== questionId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(answers));
  }

  // ✅ Check if all answers are synced
  static allAnswersSynced() {
    return this.getPendingAnswers().length === 0;
  }
}

export { QuizTakingOfflineStorage };
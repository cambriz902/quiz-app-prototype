# Next.js Quiz App

## Overview
This project is a **full-stack quiz application** built using **Next.js**, **TypeScript**, and **Neon PostgreSQL (via Prisma ORM)**.  
The application allows users to **take quizzes**, **answer multiple-choice and free-response questions**, and **view their results**.  

## Features
### Core Quiz Functionality
- Users can start a quiz.
- Supports **multiple-choice and free-response** questions.
- Tracks **quiz progress** and ensures users can **resume where they left off**.
- Enforces **one active quiz attempt per user**.
- **quiz timer** redirect user to results page when expired

### Quiz Results & Feedback
- Users can **view their quiz score** after completion.
- **Correct answers** are highlighted **green**, incorrect answers **red**.
- Free-response answers are marked **correct/incorrect** using the `isCorrectFreeResponse` field.
- **Unanswered** have **gray** background with **yellow** border.
- Users can retake quiz with **Retate Quiz** button

### Persistence & State Management
- Saves user answers to the database via **Prisma ORM**.
- Uses **Neon PostgreSQL** for relational data storage.
- **Handles quiz time expiration** and redirect to results.

### API Endpoints
- `POST /api/quizzes/[quiz_id]/start` → Start a new quiz attempt.
- `POST /api/quizzes/[quiz_id]/questions/[question_id]/answer` → Submit an answer.
- `GET /api/quizzes/[quiz_id]/results?attemptId=[id]` → Fetch results of a quiz attempt.

### Assumptions
- Users must be online to load the initial quiz data and submit their responses for grading, especially for free-response questions.
- Users cannot submit an answer for a question that has already been answered.
- Edge cases, such as incomplete answers and expired attempts, are handled gracefully to ensure a smooth user experience.

## Future Enhancements
- **No authentication or permission checking** is currently implemented but can be added.
- **Support for handling server errors (500s)** to prevent data loss.
- **Pagination for quiz attempts**; currently, only the latest attempt is displayed.
- **Free-response answers are assumed correct by default** unless validation logic is added.
- **Optimistic answering**: If answers are not saved successfully due to server issues, they can be synced on the next submission.
- **Use IndexedDB instead of LocalStorage** to allow more space for longer quizzes in offline mode.
- **Add tests** for API routes, models, and UI components.
- **Enhance free-response answer validation** by using **LLMs** or **RAG (Retrieval-Augmented Generation)** if the answer is present in course materials.
- **Modularize `<QuizContainer />`** Example: Create a `<Question />` component to encapsulate logic.
- **Improve SEO & metadata** for routes like `/quizzes/` and `/quizzes/[quiz_id]`.
- **Batch answer updates when syncing after the user goes back online**.
- **Before saving an answer, check if the user has already submitted an answer**, and add logic to handle duplicate submissions.
- Handle quiz timer running out when user is offline.

## End-to-End Test Plan

This test plan outlines test cases for verifying the core functionalities of the Next.js Quiz App. It includes navigation, quiz interactions, submission, results, edge cases, and API testing.

### Manual Test Plan

#### Home Page Navigation
**Steps:**
- User opens the app at `/`.
- Homepage should display a list of available quizzes.
- User clicks a quiz, which redirects them to `/quizzes/[quiz_id]`.

**Expected Result:**
- User sees a list of quizzes.
- Clicking a quiz redirects them to the quiz details page.

**Manual Results:** Passed

---

#### Accessing a Quiz Page
**Steps:**
- User navigates to `/quizzes/[quiz_id]`.
- Page displays quiz title, description, and `<StartQuizButton />`.
- If the user has a completed attempt, it is displayed below the button.

**Expected Result:**
- Quiz title and description appear.
- Start quiz button is visible.
- Latest attempt (if any) is displayed for review.

**Manual Results:** Passed

---

#### Starting a Quiz
**Steps:**
- User clicks the `<StartQuizButton />`.
- Backend API `/api/quizzes/[quiz_id]/start` is called.
- User is redirected to the first question.

**Expected Result:**
- User is taken to the first question of the quiz.
- Quiz attempt is recorded in the database.
- If the API call fails, an error message is displayed.

**Manual Results:** Passed

---

#### Answering Multiple Choice Questions
**Steps:**
- User selects an answer.
- The 'Next Question' button is enabled.
- User clicks 'Next Question', and answer is saved.

**Expected Result:**
- User's answer is stored correctly.
- App progresses to the next question.

**Manual Results:** Passed

---

#### Answering Free Response Questions
**Steps:**
- User types an answer in the text box.
- The 'Next Question' button is enabled.
- User clicks 'Next Question', and answer is saved.

**Expected Result:**
- User's answer is saved correctly.
- App progresses to the next question.

**Manual Results:** Passed

---

#### Submitting a Quiz
**Steps:**
- User answers the last question.
- User is redirected to `/quizzes/[quiz_id]/results`.

**Expected Result:**
- Attempt `durationInSeconds` is populated.
- User is taken to the results page.

**Manual Results:** Passed

---

#### Viewing Latest Attempt
**Steps:**
- User visits `/quizzes/[quiz_id]`.
- Latest attempt is displayed below `<StartQuizButton />`.
- Clicking the attempt redirects to `/quizzes/[quiz_id]/results?attempt=[id]`.

**Expected Result:**
- Latest attempt is visible.
- Clicking on the attempt navigates to the results page.

**Manual Results:** Passed

---

#### Viewing Detailed Quiz Results
**Steps:**
- User visits `/quizzes/[quiz_id]/results?attempt=[id]`.
- Results page displays correct/incorrect answers, score, and review options.

**Expected Result:**
- User sees correct and incorrect answers.
- Score is displayed accurately.
- Multiple choice questions are displayed with right and wrong answers.
- Unanswered questions are displayed.
- Free response questions are displayed as unanswered/correct/incorrect.
- Option to retake the quiz is available.

**Manual Results:** Passed

---

#### Refreshing While Taking a Quiz
**Steps:**
- User starts a quiz.
- User refreshes the browser mid-way.
- App reloads and restores previous answers.

**Expected Result:**
- Quiz resumes from where the user left off.
- Previously answered questions are retained.

**Manual Results:** Passed

---

#### Quiz Timer Expiration
**Steps:**
- User starts a timed quiz.
- Time runs out before submission.
- Quiz auto-submits, and user is redirected to `/quizzes/[quiz_id]/results`.

**Expected Result:**
- Quiz is automatically submitted when time expires.
- User is redirected to results page.

**Manual Results:** Passed

---

#### API - Start Quiz
**Steps:**
- Send a `POST` request to `/api/quizzes/[quiz_id]/start`.
- Check if the request succeeds and returns quiz attempt details.

**Expected Result:**
- API returns a new attempt with: `id`, `quizEndTime`, and `durationInSeconds`.
- Response format matches expected JSON structure.

**Manual Results:** Passed

---

#### API - Submit Quiz
**Steps:**
- Send a `POST` request to `/api/quizzes/[quiz_id]/answer`.
- Provide necessary attempt data.
- Verify response.

**Expected Result:**
- Creates `userAttemptedQuestionFreeResponse` or `userAttemptedQuestionMultipleChoice`.
- Updates `score`, `correct`, and `incorrect` fields.
- Updates `durationInSeconds` if the last question is submitted.

**Manual Results:** Passed

---

#### API - User Goes Offline and Back Online
**Steps:**
- User starts a quiz and is in `/quizzes/[quiz_id]`.
- User goes offline.
- User can keep taking the quiz until the last answer.
- User comes back online.
- User submits the last question.

**Expected Result:**
- User sees an offline banner when they go offline.
- User can take questions offline.
- User cannot submit the last question until going back online.
- User sees answers being synced when they go back online.
- User can submit the last question.
- User is redirected to the results page.

**Manual Results:** Passed
---

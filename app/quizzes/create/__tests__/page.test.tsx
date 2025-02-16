import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import Page from '../page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('Create Quiz Page', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter)
    // Reset fetch mock before each test
    global.fetch = jest.fn()
  })

  it('renders the create quiz form', () => {
    render(<Page />)
    
    expect(screen.getByText('Create Quiz')).toBeInTheDocument()
    expect(screen.getByLabelText(/Topic/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Multiple Choice Questions/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Free Response Questions/i)).toBeInTheDocument()
  })

  it('shows topic helper when clicking the question mark icon', () => {
    render(<Page />)
    
    const helpButton = screen.getByTestId('topic-help-button')
    fireEvent.click(helpButton)
    
    expect(screen.getByText('Tips for a better quiz:')).toBeInTheDocument()
    expect(screen.getByText(/Be specific about your topic/)).toBeInTheDocument()
  })

  it('disables submit button when form is invalid', () => {
    render(<Page />)
    
    const submitButton = screen.getByRole('button', { name: /create quiz/i })
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when form is valid', () => {
    render(<Page />)
    
    fireEvent.change(screen.getByLabelText(/Topic/i), { target: { value: 'World War II' } })
    fireEvent.change(screen.getByLabelText(/Multiple Choice Questions/i), { target: { value: '5' } })
    
    const submitButton = screen.getByRole('button', { name: /create quiz/i })
    expect(submitButton).not.toBeDisabled()
  })

  it('submits form and redirects on success', async () => {
    const mockQuizId = 123
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ quizId: mockQuizId }),
    })

    render(<Page />)
    
    // Fill out form
    fireEvent.change(screen.getByLabelText(/Topic/i), { target: { value: 'World War II' } })
    fireEvent.change(screen.getByLabelText(/Multiple Choice Questions/i), { target: { value: '5' } })
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create quiz/i }))
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/quizzes/create', {
        method: 'POST',
        body: JSON.stringify({
          topic: 'World War II',
          numMultipleChoiceQuestions: 5,
          numFreeResponseQuestions: 0,
        }),
      })
      expect(mockRouter.push).toHaveBeenCalledWith(`/quizzes/${mockQuizId}`)
    })
  })
}) 
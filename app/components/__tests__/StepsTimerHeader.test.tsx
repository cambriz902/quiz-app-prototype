import { render, screen } from '@testing-library/react';
import StepsTimerHeader from '../StepsTimerHeader';

// Mock the useCountdownTimer hook
jest.mock('@/utils/useCountdownTimer', () => ({
  __esModule: true,
  default: jest.fn(() => 300), // Returns 300 seconds (5 minutes)
}));

describe('StepsTimerHeader', () => {
  const defaultProps = {
    targetTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
    currentStep: 0,
    totalSteps: 5,
    onTimerEnd: jest.fn(),
  };

  it('renders step count correctly', () => {
    render(<StepsTimerHeader {...defaultProps} />);
    expect(screen.getByText('Step 1 of 6')).toBeInTheDocument(); //fails for action test
  });

  it('renders custom label when provided', () => {
    render(<StepsTimerHeader {...defaultProps} label="Question" />);
    expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();
  });

  it('renders timer with correct format', () => {
    render(<StepsTimerHeader {...defaultProps} />);
    expect(screen.getByText('Time Left: 5:00')).toBeInTheDocument();
  });

  it('handles zero time remaining', () => {
    jest.mock('@/utils/useCountdownTimer', () => ({
      __esModule: true,
      default: jest.fn(() => 0),
    }));
    render(<StepsTimerHeader {...defaultProps} />);
    expect(screen.getByText(/Time Left:/)).toBeInTheDocument();
  });
}); 
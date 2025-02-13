import { render, screen, fireEvent } from '@testing-library/react';
import NavBar from '../NavBar';

describe('NavBar', () => {
  it('renders logo and navigation links', () => {
    render(<NavBar />);
    
    // Check if logo exists
    expect(screen.getByText('QuizAI')).toBeInTheDocument();
    
    // Check if navigation links exist
    expect(screen.getByText('Create Quiz')).toBeInTheDocument();
    expect(screen.getByText('Quizzes')).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger is clicked', () => {
    render(<NavBar />);
    
    // Mobile menu should be hidden initially
    expect(screen.queryByRole('button')).toBeInTheDocument();
    
    // Click hamburger menu
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);
    
    // Mobile menu should be visible
    expect(screen.getAllByText('Create Quiz')).toHaveLength(2); // Both mobile and desktop versions
  });
});
  
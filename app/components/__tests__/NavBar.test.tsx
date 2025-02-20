import { render, screen, fireEvent } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import NavBar from '../NavBar';

// Mock next-auth session
const mockSession: { 
  data: { user: { name: string } } | null; 
  status: 'authenticated' | 'unauthenticated' 
} = {
  data: null,
  status: 'unauthenticated'
};

jest.mock('next-auth/react', () => ({
  useSession: () => mockSession,
  signOut: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children
}));

describe('NavBar', () => {
  const renderNavBar = () => {
    return render(
      <SessionProvider session={null}>
        <NavBar />
      </SessionProvider>
    );
  };

  it('renders logo and navigation links', () => {
    renderNavBar();
    expect(screen.getByText('QuizAI')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger is clicked', () => {
    renderNavBar();
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);
    expect(screen.getAllByText('Login')).toHaveLength(2);
  });

  it('renders authenticated navigation when session exists', () => {
    mockSession.data = { user: { name: 'Test User' } };
    mockSession.status = 'authenticated';
    
    renderNavBar();
    
    expect(screen.getByText('Create Quiz')).toBeInTheDocument();
    expect(screen.getByText('Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    
    // Reset mock for other tests
    mockSession.data = null;
    mockSession.status = 'unauthenticated';
  });
});
  
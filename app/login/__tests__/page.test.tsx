import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import LoginPage from '../page';
import { mockRouter } from '@/../jest.setup';

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    render(<LoginPage />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<LoginPage />);
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('shows error message for invalid credentials', async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: 'Invalid credentials' });
    
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it('redirects to callback URL on successful login', async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });
    
    // Mock window.location.search
    Object.defineProperty(window, 'location', {
      value: {
        search: '?callbackUrl=%2Fquizzes%2F5',
      },
    });
    
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/quizzes/5');
    });
  });

  it('redirects to /quizzes when no callback URL', async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });
    
    Object.defineProperty(window, 'location', {
      value: { search: '' },
      configurable: true
    });
    
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalled();
    });
    
    expect(mockRouter.push).toHaveBeenCalledWith('/quizzes');
  });
}); 
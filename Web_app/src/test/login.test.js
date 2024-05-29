import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/user-event';
import '@testing-library/jest-dom';

import LoginForm from '../main/login';

describe('LoginForm Component', () => {
    test('allows a user to sign up and then log in with new credentials', async () => {
      const mockOnLogin = jest.fn();
      render(<LoginForm onLogin={mockOnLogin} />);
      
      // Simulate user entering email and password to sign up
      fireEvent.change(screen.getByPlaceholderText('Email Id'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByText('Sign up'));
  
      // Assert sign up success message
      expect(screen.getByText('Email: test@example.com signed up successfully.')).toBeInTheDocument();
  
      // Clear input fields
      fireEvent.change(screen.getByPlaceholderText('Email Id'), {
        target: { value: '' },
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: '' },
      });
  
      // Simulate user entering email and password to log in
      fireEvent.change(screen.getByPlaceholderText('Email Id'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByText('Log in'));
  
      // Assert log in success message and onLogin callback
      expect(screen.getByText('Email: test@example.com logged in successfully.')).toBeInTheDocument();
      expect(mockOnLogin).toHaveBeenCalledWith('test@example.com');
    });
  
    test('displays an error message if login with incorrect details', async () => {
      render(<LoginForm onLogin={jest.fn()} />);
  
      // Simulate user entering incorrect login details
      fireEvent.change(screen.getByPlaceholderText('Email Id'), {
        target: { value: 'wrong@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'wrongPassword' },
      });
      fireEvent.click(screen.getByText('Log in'));
  
      // Assert error message
      expect(screen.getByText('Incorrect login details or user not signed up.')).toBeInTheDocument();
    });
  });


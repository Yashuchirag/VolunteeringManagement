import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import App from '../main/App'; 

describe('App Component', () => {
  test('renders LoginForm when no user is logged in', () => {
    render(<App />);
    // Check if LoginForm component is rendered by looking for its specific elements
    expect(screen.getByPlaceholderText('Email Id')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  test('renders Homepage and passes correct props when user logs in', () => {
    render(<App />);
    // Simulate login by entering email and clicking the login button
    fireEvent.change(screen.getByPlaceholderText('Email Id'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByText('Log in'));

    // Use findByText for asynchronous elements, assuming login triggers a state update
    screen.findByText('Welcome to Homepage, john').then(welcomeText => {
      expect(welcomeText).toBeInTheDocument();
    });

    // Verify that the homepage is displaying events, checking for event names as an example
    screen.findByText('Pilot Event').then(eventText => {
      expect(eventText).toBeInTheDocument();
    });
  });
});

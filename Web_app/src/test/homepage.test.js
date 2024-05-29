import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Homepage from '../main/homepage.js';



describe('Homepage Component', () => {
    const mockEvents = [
      {
        name: 'Pilot Event',
        description: 'Getting the event started for Volunteers Management platform',
        date: '04/10/2024',
        time: '9:00 PM',
        volunteersNeeded: 4
      },
      {
        name: 'Second Event',
        description: 'Second big event',
        date: '05/10/2024',
        time: '10:00 AM',
        volunteersNeeded: 2
      }
    ];
  
    it('renders correctly with given props', () => {
      render(<Homepage user="JohnDoe" events={mockEvents} />);
      
      // Check for the welcome message
      expect(screen.getByText(/Welcome, JohnDoe!/)).toBeInTheDocument();
      
      // Check for the subtitle
      expect(screen.getByText('Upcoming Events:')).toBeInTheDocument();
      
      // Check for table headers
      expect(screen.getByText('Event Name')).toBeInTheDocument();
      expect(screen.getByText('Event Description')).toBeInTheDocument();
      expect(screen.getByText('Event Date')).toBeInTheDocument();
      expect(screen.getByText('Event Time')).toBeInTheDocument();
      expect(screen.getByText('Volunteers needed')).toBeInTheDocument();
      
      // Check for event data in the table
      mockEvents.forEach(event => {
        expect(screen.getByText(event.name)).toBeInTheDocument();
        expect(screen.getByText(event.description)).toBeInTheDocument();
        expect(screen.getByText(event.date)).toBeInTheDocument();
        expect(screen.getByText(event.time)).toBeInTheDocument();
        expect(screen.getByText(event.volunteersNeeded.toString())).toBeInTheDocument();
      });
    });
  });

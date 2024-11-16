// client/src/api/ticketAPI.tsx
import { API_BASE_URL } from '../utils/config';
import Auth from '../utils/auth';
import { TicketData } from '../interfaces/TicketData';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${Auth.getToken()}`
});

const retrieveTickets = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

const retrieveTicket = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ticket');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error;
  }
};

const createTicket = async (ticketData: TicketData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(ticketData)
    });

    if (!response.ok) {
      throw new Error('Failed to create ticket');
    }

    return response.json();
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

const updateTicket = async (id: number, ticketData: TicketData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(ticketData)
    });

    if (!response.ok) {
      throw new Error('Failed to update ticket');
    }

    return response.json();
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};

const deleteTicket = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete ticket');
    }

    return response.json();
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
};

export { 
  retrieveTickets, 
  retrieveTicket, 
  createTicket, 
  updateTicket, 
  deleteTicket 
};
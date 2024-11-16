// client/src/pages/EditTicket.tsx
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { retrieveTicket, updateTicket } from '../api/ticketAPI';
import { TicketData } from '../interfaces/TicketData';

const EditTicket = () => {
  const [ticket, setTicket] = useState<TicketData | undefined>();
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { state } = useLocation();

  const fetchTicket = async (ticketData: TicketData) => {
    try {
      const data = await retrieveTicket(ticketData.id);
      setTicket(data);
    } catch (err) {
      console.error('Failed to retrieve ticket:', err);
      setError('Failed to fetch ticket details');
    }
  };

  useEffect(() => {
    if (state && 'id' in state) {
      fetchTicket(state as TicketData);
    } else {
      setError('No ticket selected for editing');
    }
  }, [state]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (ticket && ticket.id) {
      try {
        await updateTicket(ticket.id, ticket);
        navigate('/');
      } catch (err) {
        console.error('Failed to update ticket:', err);
        setError('Failed to update ticket');
      }
    } else {
      console.error('Ticket data is undefined.');
      setError('Invalid ticket data');
    }
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTicket((prev) => (prev ? { ...prev, [name]: value } : undefined));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTicket((prev) => (prev ? { ...prev, [name]: value } : undefined));
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className='container'>
      {ticket ? (
        <form className='form' onSubmit={handleSubmit}>
          <h1>Edit Ticket</h1>
          <label htmlFor='tName'>Ticket Name</label>
          <textarea
            id='tName'
            name='name'
            value={ticket.name || ''}
            onChange={handleTextAreaChange}
          />
          <label htmlFor='tStatus'>Ticket Status</label>
          <select
            name='status'
            id='tStatus'
            value={ticket.status || ''}
            onChange={handleChange}
          >
            <option value='Todo'>Todo</option>
            <option value='In Progress'>In Progress</option>
            <option value='Done'>Done</option>
          </select>
          <label htmlFor='tDescription'>Ticket Description</label>
          <textarea
            id='tDescription'
            name='description'
            value={ticket.description || ''}
            onChange={handleTextAreaChange}
          />
          <div className="button-group">
            <button type='submit'>Save Changes</button>
            <button type='button' onClick={() => navigate('/')}>Cancel</button>
          </div>
        </form>
      ) : (
        <div>Loading ticket details...</div>
      )}
    </div>
  );
};

export default EditTicket;
// client/src/pages/CreateTicket.tsx
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../api/ticketAPI';
import { TicketData } from '../interfaces/TicketData';
import { UserData } from '../interfaces/UserData';
import { retrieveUsers } from '../api/userAPI';

const CreateTicket = () => {
  const [newTicket, setNewTicket] = useState<TicketData>({
    id: 0,
    name: '',
    description: '',
    status: 'Todo',
    assignedUserId: undefined,  // Changed this line
    assignedUser: null
  });

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      const data = await retrieveUsers();
      setUsers(data);
      if (data.length > 0) {
        setNewTicket(prevTicket => ({
          ...prevTicket,
          assignedUserId: data[0].id || undefined
        }));
      }
    } catch (err) {
      setError('Failed to load users');
      console.error('Failed to retrieve user info:', err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createTicket(newTicket);
      navigate('/');
    } catch (err) {
      setError('Failed to create ticket');
      console.error('Failed to create ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({
      ...prev,
      [name]: name === 'assignedUserId' ? parseInt(value, 10) : value
    }));
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <div className="form-card fade-in">
          <div className="form-header">
            <h1>Create New Ticket</h1>
          </div>
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Ticket Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newTicket.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter ticket name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={newTicket.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={newTicket.description}
                onChange={handleChange}
                className="form-textarea"
                rows={4}
                required
                placeholder="Enter ticket description"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="assignedUserId">Assign To</label>
              <select
                id="assignedUserId"
                name="assignedUserId"
                value={String(newTicket.assignedUserId)}
                onChange={handleChange}
                className="form-select"
              >
                {users.map(user => (
                  <option 
                    key={user.id} 
                    value={String(user.id)}
                  >
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            <div className="button-group">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="animate-button secondary"
              >
                <span className="button-content">
                  Cancel
                </span>
              </button>
              
              <button
                type="submit"
                className={`animate-button primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                <span className="button-content">
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Creating...
                    </>
                  ) : (
                    'Create Ticket'
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
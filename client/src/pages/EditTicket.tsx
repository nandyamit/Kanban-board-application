// client/src/pages/EditTicket.tsx
import React from 'react';
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateTicket, retrieveTicket } from '../api/ticketAPI';  // Make sure this import matches your actual API file
import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';



interface LocationState {
  id: number;
  [key: string]: unknown;
}

const EditTicket = (): JSX.Element => {
  const [ticket, setTicket] = useState<TicketData | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();

  const fetchTicketData = async (ticketData: LocationState) => {
    setLoading(true);
    try {
      const data = await retrieveTicket(ticketData.id);
      setTicket(data);
    } catch (err) {
      setError('Failed to fetch ticket details');
      console.error('Failed to retrieve ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state && 'id' in state) {
      fetchTicketData(state as LocationState);
    } else {
      setError('No ticket selected for editing');
    }
  }, [state]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!ticket?.id) return;

    setSaving(true);
    setError(null);
    try {
      await updateTicket(ticket.id, ticket);
      navigate('/');
    } catch (err) {
      setError('Failed to update ticket');
      console.error('Failed to update ticket:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTicket(prev => prev ? { ...prev, [name]: value } : undefined);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="form-container">
          <div className="form-card">
            <div className="loading-state">
              <span className="spinner" />
              Loading ticket details...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="form-container">
          <div className="form-card">
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
              <div className="mt-4">
                <button 
                  onClick={() => navigate('/')} 
                  className="animate-button primary"
                >
                  <span className="button-content">
                    Return to Board
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-container">
        {ticket ? (
          <div className="form-card fade-in">
            <div className="form-header">
              <h1>Edit Ticket</h1>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Ticket Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={ticket.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Enter ticket name"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={ticket.status}
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
                  value={ticket.description}
                  onChange={handleChange}
                  className="form-textarea"
                  rows={4}
                  required
                  placeholder="Enter ticket description"
                />
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
                  className={`animate-button primary ${saving ? 'loading' : ''}`}
                  disabled={saving}
                >
                  <span className="button-content">
                    {saving ? (
                      <>
                        <span className="spinner" />
                        Saving Changes...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="form-card">
            <div className="empty-state">
              <p>No ticket data available</p>
              <button 
                onClick={() => navigate('/')} 
                className="animate-button primary mt-4"
              >
                <span className="button-content">
                  Return to Board
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditTicket;
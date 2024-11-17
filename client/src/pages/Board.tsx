// client/src/pages/Board.tsx
import { useEffect, useState, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { retrieveTickets, deleteTicket } from '../api/ticketAPI';
import ErrorPage from './ErrorPage';
import Swimlane from '../components/Swimlane';
import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';
import auth from '../utils/auth';

const boardStates = ['Todo', 'In Progress', 'Done'];

type SortField = keyof Pick<TicketData, 'name' | 'status' | 'assignedUser'>;
type SortDirection = 'asc' | 'desc';

const Board = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketData[]>([]);
  const [error, setError] = useState(false);
  const [loginCheck, setLoginCheck] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await retrieveTickets();
      setTickets(data);
      setFilteredTickets(data);
    } catch (err) {
      console.error('Failed to retrieve tickets:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteIndvTicket = async (ticketId: number): Promise<ApiMessage> => {
    try {
      const data = await deleteTicket(ticketId);
      await fetchTickets();
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useLayoutEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    if (loginCheck) {
      fetchTickets();
    }
  }, [loginCheck]);

  useEffect(() => {
    let result = [...tickets];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(ticket =>
        ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(ticket => ticket.status === statusFilter);
    }

    // Apply sorting with type safety
    result.sort((a, b) => {
      const valueA = String(a[sortField] || '');
      const valueB = String(b[sortField] || '');

      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      }
      return valueB.localeCompare(valueA);
    });

    setFilteredTickets(result);
  }, [tickets, searchTerm, statusFilter, sortField, sortDirection]);

  if (error) return <ErrorPage />;

  if (!loginCheck) {
    return (
      <div className="page-container">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Welcome to Kanban Board</h1>
              <p>Please log in to view and manage your tickets</p>
            </div>
            <Link to="/login" className="animate-button primary w-full">
              <span className="button-content">
                Sign In to Continue
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="board-container fade-in">
      <div className="board-header">
        <div className="header-content">
          <h1>Your Board</h1>
          <Link 
            to="/create" 
            className="animate-button primary"
          >
            <span className="button-content">
              <span className="icon">+</span>
              New Ticket
            </span>
          </Link>
        </div>

        <div className="filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              {boardStates.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <div className="sort-group">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="sort-select"
              >
                <option value="name">Sort by Name</option>
                <option value="status">Sort by Status</option>
                <option value="assignedUser">Sort by Assignee</option>
              </select>
              
              <button
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="sort-direction-btn"
                title={`Sort ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        <div className="results-summary">
          Showing {filteredTickets.length} of {tickets.length} tickets
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <span className="spinner" />
          Loading tickets...
        </div>
      ) : (
        <div className="board-display">
          {boardStates.map((status) => (
            <Swimlane
              title={status}
              key={status}
              tickets={filteredTickets.filter(ticket => ticket.status === status)}
              deleteTicket={deleteIndvTicket}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Board;
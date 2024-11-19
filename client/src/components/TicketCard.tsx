// components/TicketCard.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';
import Modal from './Modal';

interface TicketCardProps {
  ticket: TicketData;
  deleteTicket: (id: number) => Promise<ApiMessage>;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, deleteTicket }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTicket(ticket.id);
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Failed to delete ticket:', err);
    }
  };

  const getStatusClass = (status: string) => {
    const baseClass = status.toLowerCase().replace(' ', '-');
    return `ticket-card ${baseClass}`;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'todo': return 'status-badge status-todo';
      case 'in progress': return 'status-badge status-progress';
      case 'done': return 'status-badge status-done';
      default: return 'status-badge';
    }
  };

  const assignedUserName = typeof ticket.assignedUser === 'string' 
    ? ticket.assignedUser 
    : ticket.assignedUser?.username || 'Unassigned';

  const assigneeInitial = assignedUserName[0]?.toUpperCase() || '?';

  return (
    <>
      <div className={getStatusClass(ticket.status)}>
        <div className="card-decorator" />
        
        <div className="ticket-header">
          <h3 className="ticket-title">{ticket.name}</h3>
          <span className={getStatusBadgeClass(ticket.status)}>
            {ticket.status}
          </span>
        </div>

        <p className="ticket-description">{ticket.description}</p>

        <div className="ticket-meta">
          <div className="ticket-info">
            <div className="ticket-assignee">
              <div className="assignee-avatar">
                {assigneeInitial}
              </div>
              <span>{assignedUserName}</span>
            </div>
          </div>
        </div>

        <div className="ticket-actions">
          <Link
            to={`/edit/${ticket.id}`}
            state={ticket}
          >
            Edit
          </Link>
          <button onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      <Modal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        type="delete"
        itemName={ticket.name}
      />
    </>
  );
};

export default TicketCard;
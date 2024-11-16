// client/src/components/TicketCard.tsx
import { Link } from 'react-router-dom';
import { TicketData } from '../interfaces/TicketData';

interface TicketCardProps {
  ticket: TicketData;
  deleteTicket: (id: number) => Promise<any>;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, deleteTicket }) => {
  const handleDelete = async () => {
    try {
      await deleteTicket(ticket.id);
    } catch (err) {
      console.error('Failed to delete ticket:', err);
    }
  };

  // Extract assignedUser value safely
  const assignedUserName = typeof ticket.assignedUser === 'string' 
    ? ticket.assignedUser 
    : ticket.assignedUser?.username || 'Unassigned';

  return (
    <div className="ticket-card">
      <div className="ticket-content">
        <h3>{ticket.name}</h3>
        <p>{ticket.description}</p>
        <p>Status: {ticket.status}</p>
        <p>Assigned to: {assignedUserName}</p>
      </div>
      <div className="ticket-actions">
        <Link
          to={`/edit/${ticket.id}`}
          state={ticket}
        >
          Edit
        </Link>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default TicketCard;
// client/src/components/Swimlane.tsx
import TicketCard from './TicketCard';
import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';

interface SwimlaneProps {
  title: string;
  tickets: TicketData[];
  deleteTicket: (ticketId: number) => Promise<ApiMessage>
  key?: string;
}

const Swimlane: React.FC<SwimlaneProps> = ({ title, tickets, deleteTicket }) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Todo':
        return 'status-todo';
      case 'In Progress':
        return 'status-progress';
      case 'Done':
        return 'status-done';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Todo':
        return '📋';
      case 'In Progress':
        return '⚡';
      case 'Done':
        return '✅';
      default:
        return '📌';
    }
  };

  return (
    <div className={`swimlane ${getStatusClass(title)}`}>
      <div className="swimlane-header">
        <div className="swimlane-title">
          <span className="status-icon">{getStatusIcon(title)}</span>
          <span className="title-text">{title}</span>
          <span className="ticket-count">{tickets.length}</span>
        </div>
      </div>
      
      <div className="swimlane-content">
        {tickets.length === 0 ? (
          <div className="empty-lane">
            <p>No tickets in {title}</p>
            <p className="empty-icon">🎯</p>
          </div>
        ) : (
          tickets.map(ticket => (
            <TicketCard 
              key={ticket.id}
              ticket={ticket}
              deleteTicket={deleteTicket}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Swimlane;
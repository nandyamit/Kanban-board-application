// client/src/interfaces/TicketData.tsx
export interface TicketData {
  id: number;
  name: string;
  description: string;
  status: string;
  assignedUserId: number;
  assignedUser: string | { username: string } | null;
  
}
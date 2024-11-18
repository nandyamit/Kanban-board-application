export interface TicketData {
  id: number;
  name: string;
  description: string;
  status: string;
  assignedUserId: number | undefined;  // Changed from number to number | undefined
  assignedUser: string | { username: string } | null;
}
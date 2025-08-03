export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
  category: string;
  availableTickets: number;
  totalTickets: number;
}

export interface Ticket {
  id: string;
  eventId: number;
  userId: number;
  qrCode: string;
  purchaseDate: string;
  status: 'active' | 'used' | 'expired';
  event: Event;
}

export interface Purchase {
  id: string;
  tickets: Ticket[];
  totalAmount: number;
  purchaseDate: string;
  paymentMethod: 'pix' | 'card';
  status: 'completed' | 'pending' | 'cancelled';
}
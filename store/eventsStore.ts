import { create } from 'zustand';
import { Event, Ticket, Purchase } from '../types/events';

interface EventsState {
  events: Event[];
  userTickets: Ticket[];
  userPurchases: Purchase[];
  buyTicket: (eventId: number, quantity: number) => Promise<{ success: boolean; error?: string }>;
  getUserTickets: () => Ticket[];
  getUserPurchases: () => Purchase[];
}

// Dados estáticos de eventos
const staticEvents: Event[] = [
  {
    id: 1,
    title: "Festival de Música Eletrônica",
    description: "Uma noite inesquecível com os melhores DJs do Brasil e internacional",
    date: "2025-03-15",
    time: "22:00",
    location: "Arena SP - São Paulo",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400",
    category: "Música",
    availableTickets: 450,
    totalTickets: 500
  },
  {
    id: 2,
    title: "Stand-up Comedy Show",
    description: "Noite de muitas risadas com os melhores comediantes da cidade",
    date: "2025-03-20",
    time: "20:00",
    location: "Teatro Municipal - São Paulo",
    price: 80.00,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
    category: "Comédia",
    availableTickets: 180,
    totalTickets: 200
  },
  {
    id: 3,
    title: "Conferência Tech 2025",
    description: "As últimas tendências em tecnologia e inovação",
    date: "2025-03-25",
    time: "09:00",
    location: "Centro de Convenções - São Paulo",
    price: 200.00,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
    category: "Tecnologia",
    availableTickets: 280,
    totalTickets: 300
  },
  {
    id: 4,
    title: "Workshop de Culinária",
    description: "Aprenda pratos incríveis com chefs renomados",
    date: "2025-03-30",
    time: "14:00",
    location: "Instituto Gastronômico - São Paulo",
    price: 150.00,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    category: "Gastronomia",
    availableTickets: 25,
    totalTickets: 30
  }
];

const useEventsStore = create<EventsState>((set, get) => ({
  events: staticEvents,
  userTickets: [],
  userPurchases: [],

  buyTicket: async (eventId: number, quantity: number = 1) => {
    const { events, userTickets, userPurchases } = get();
    
    // Simula delay de API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const event = events.find(e => e.id === eventId);
    if (!event) {
      return { success: false, error: 'Evento não encontrado' };
    }

    if (event.availableTickets < quantity) {
      return { success: false, error: 'Ingressos esgotados' };
    }

    // Cria novos ingressos
    const newTickets: Ticket[] = [];
    for (let i = 0; i < quantity; i++) {
      const ticketId = `ticket_${Date.now()}_${i}`;
      const newTicket: Ticket = {
        id: ticketId,
        eventId: eventId,
        userId: 2, // ID do usuário logado
        qrCode: `QR_${ticketId}`,
        purchaseDate: new Date().toISOString(),
        status: 'active',
        event: event
      };
      newTickets.push(newTicket);
    }

    // Cria a compra
    const newPurchase: Purchase = {
      id: `purchase_${Date.now()}`,
      tickets: newTickets,
      totalAmount: event.price * quantity,
      purchaseDate: new Date().toISOString(),
      paymentMethod: 'pix',
      status: 'completed'
    };

    // Atualiza o estado
    set({
      userTickets: [...userTickets, ...newTickets],
      userPurchases: [...userPurchases, newPurchase],
      events: events.map(e => 
        e.id === eventId 
          ? { ...e, availableTickets: e.availableTickets - quantity }
          : e
      )
    });

    return { success: true };
  },

  getUserTickets: () => {
    return get().userTickets;
  },

  getUserPurchases: () => {
    return get().userPurchases;
  }
}));

export default useEventsStore;
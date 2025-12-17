import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Customer, Message, customers as mockCustomers, conversations as mockConversations, botResponses } from '@/mock/messages';

interface ChatState {
  customers: Customer[];
  conversations: Record<string, Message[]>;
  activeCustomerId: string | null;
  isBotActive: boolean;
  isTyping: boolean;
  searchQuery: string;
  
  setActiveCustomer: (id: string) => void;
  toggleBot: () => void;
  sendMessage: (text: string, sender: 'admin' | 'bot') => void;
  receiveCustomerMessage: (customerId: string, text: string) => void;
  setSearchQuery: (query: string) => void;
  markAsRead: (customerId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      customers: mockCustomers,
      conversations: mockConversations,
      activeCustomerId: null,
      isBotActive: true,
      isTyping: false,
      searchQuery: '',

      setActiveCustomer: (id: string) => {
        set({ activeCustomerId: id });
        get().markAsRead(id);
      },

      toggleBot: () => {
        set((state) => ({ isBotActive: !state.isBotActive }));
      },

      sendMessage: (text: string, sender: 'admin' | 'bot') => {
        const { activeCustomerId, conversations } = get();
        if (!activeCustomerId) return;

        const newMessage: Message = {
          id: uuidv4(),
          text,
          sender,
          timestamp: new Date(),
          status: 'sent',
        };

        const updatedConversations = {
          ...conversations,
          [activeCustomerId]: [...(conversations[activeCustomerId] || []), newMessage],
        };

        set({ conversations: updatedConversations });

        // Update message status after delay
        setTimeout(() => {
          set((state) => ({
            conversations: {
              ...state.conversations,
              [activeCustomerId]: state.conversations[activeCustomerId]?.map((m) =>
                m.id === newMessage.id ? { ...m, status: 'delivered' } : m
              ) || [],
            },
          }));
        }, 500);

        setTimeout(() => {
          set((state) => ({
            conversations: {
              ...state.conversations,
              [activeCustomerId]: state.conversations[activeCustomerId]?.map((m) =>
                m.id === newMessage.id ? { ...m, status: 'read' } : m
              ) || [],
            },
          }));
        }, 1500);
      },

      receiveCustomerMessage: (customerId: string, text: string) => {
        const { conversations, isBotActive, activeCustomerId } = get();

        const newMessage: Message = {
          id: uuidv4(),
          text,
          sender: 'customer',
          timestamp: new Date(),
          status: 'delivered',
        };

        const updatedConversations = {
          ...conversations,
          [customerId]: [...(conversations[customerId] || []), newMessage],
        };

        // Update unread count if not active
        set((state) => ({
          conversations: updatedConversations,
          customers: state.customers.map((c) =>
            c.id === customerId && c.id !== activeCustomerId
              ? { ...c, unreadCount: c.unreadCount + 1 }
              : c
          ),
        }));

        // Auto-reply if bot is active
        if (isBotActive) {
          set({ isTyping: true });
          
          setTimeout(() => {
            const lowerText = text.toLowerCase();
            let response = botResponses.default;
            
            if (lowerText.includes('catalog') || lowerText.includes('product')) {
              response = botResponses.catalog;
            } else if (lowerText.includes('price') || lowerText.includes('cost')) {
              response = botResponses.price;
            } else if (lowerText.includes('human') || lowerText.includes('agent') || lowerText.includes('person')) {
              response = botResponses.human;
            } else if (lowerText.includes('track') || lowerText.includes('order') || lowerText.includes('status')) {
              response = botResponses.track;
            } else if (lowerText.includes('return') || lowerText.includes('refund')) {
              response = botResponses.return;
            }

            set({ isTyping: false });
            get().sendMessage(response, 'bot');
          }, 1500);
        }
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      markAsRead: (customerId: string) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === customerId ? { ...c, unreadCount: 0 } : c
          ),
        }));
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        isBotActive: state.isBotActive,
      }),
    }
  )
);

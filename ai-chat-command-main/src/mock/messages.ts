import { v4 as uuidv4 } from 'uuid';

export type MessageSender = 'customer' | 'bot' | 'admin';
export type MessageStatus = 'sent' | 'delivered' | 'read';
export type CustomerTag = 'new' | 'returning' | 'high-intent' | 'vip';

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
  status: MessageStatus;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  online: boolean;
  lastSeen: Date;
  tag: CustomerTag;
  unreadCount: number;
}

export interface Conversation {
  customerId: string;
  messages: Message[];
}

export const customers: Customer[] = [
  {
    id: "c1",
    name: "Michael Chen",
    phone: "+1 234 567 8901",
    online: true,
    lastSeen: new Date(),
    tag: "high-intent",
    unreadCount: 2
  },
  {
    id: "c2",
    name: "Emma Rodriguez",
    phone: "+1 345 678 9012",
    online: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
    tag: "returning",
    unreadCount: 0
  },
  {
    id: "c3",
    name: "David Kim",
    phone: "+1 456 789 0123",
    online: true,
    lastSeen: new Date(),
    tag: "new",
    unreadCount: 1
  },
  {
    id: "c4",
    name: "Sofia Martinez",
    phone: "+1 567 890 1234",
    online: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
    tag: "vip",
    unreadCount: 0
  },
  {
    id: "c5",
    name: "James Thompson",
    phone: "+1 678 901 2345",
    online: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 24),
    tag: "returning",
    unreadCount: 0
  }
];

export const conversations: Record<string, Message[]> = {
  c1: [
    {
      id: uuidv4(),
      text: "Hi! I'm interested in the Premium Headphones. Are they in stock?",
      sender: "customer",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: "read"
    },
    {
      id: uuidv4(),
      text: "Hello Michael! 👋 Yes, the Premium Headphones are currently in stock. They feature active noise cancellation and 30-hour battery life. Would you like more details?",
      sender: "bot",
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
      status: "read"
    },
    {
      id: uuidv4(),
      text: "Yes please! What colors are available?",
      sender: "customer",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      status: "read"
    }
  ],
  c2: [
    {
      id: uuidv4(),
      text: "I received my order but the color is wrong",
      sender: "customer",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: "read"
    },
    {
      id: uuidv4(),
      text: "I'm sorry to hear that, Emma. Let me connect you with our support team to resolve this quickly.",
      sender: "bot",
      timestamp: new Date(Date.now() - 1000 * 60 * 58),
      status: "read"
    },
    {
      id: uuidv4(),
      text: "Hi Emma, I'm Alex from support. I can see your order #12345. We'll send the correct item right away and arrange pickup for the wrong one. Is that okay?",
      sender: "admin",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      status: "read"
    },
    {
      id: uuidv4(),
      text: "Yes, that would be great. Thank you!",
      sender: "customer",
      timestamp: new Date(Date.now() - 1000 * 60 * 40),
      status: "read"
    }
  ],
  c3: [
    {
      id: uuidv4(),
      text: "Hello! First time here. What do you sell?",
      sender: "customer",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      status: "read"
    },
    {
      id: uuidv4(),
      text: "Welcome to our store! 🎉 We offer premium electronics, accessories, and footwear. Would you like me to show you our catalog?",
      sender: "bot",
      timestamp: new Date(Date.now() - 1000 * 60 * 9),
      status: "read"
    }
  ],
  c4: [
    {
      id: uuidv4(),
      text: "Hi, I'd like to place a bulk order for my company",
      sender: "customer",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      status: "read"
    },
    {
      id: uuidv4(),
      text: "Hello Sofia! For bulk orders, I'll connect you with our business team who can offer special pricing and arrangements.",
      sender: "bot",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3 + 60000),
      status: "read"
    },
    {
      id: uuidv4(),
      text: "Hi Sofia, this is Sarah from our business team. I'd be happy to assist with your bulk order. How many units are you looking at?",
      sender: "admin",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
      status: "read"
    }
  ],
  c5: [
    {
      id: uuidv4(),
      text: "Thanks for the quick delivery!",
      sender: "customer",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: "read"
    },
    {
      id: uuidv4(),
      text: "You're welcome, James! We're glad your order arrived safely. Don't hesitate to reach out if you need anything! ⭐",
      sender: "bot",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 + 60000),
      status: "read"
    }
  ]
};

export const quickReplies = [
  "hi how may i help you today?",
  "Please hold while I check that for you.",
  "Thank you for reaching out to us!",
  "Is there anything else I can assist you with?",
  "Welcome to our store! How can I assist you?",
  "Can you provide more details?",
  "I'd be happy to help with that.",
  "Please hold while I check that for you.",
  "Thank you for reaching out to us!",
  "Is there anything else I can assist you with?",
];

export const botResponses: Record<string, string> = {
  "catalog": "Here's our latest catalog! We have Electronics, Accessories, and Footwear. What category interests you?",
  "price": "Our prices range from $79.99 to $449.99. Would you like details on a specific product?",
  "human": "I'll connect you with a team member right away. Please hold.",
  "track": "Please share your order number and I'll look up the status for you.",
  "return": "We offer 30-day returns on all items. Would you like to start a return?",
  "default": "Thanks for your message! How can I assist you today?"
};

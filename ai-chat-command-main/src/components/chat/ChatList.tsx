import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface ChatListProps {
  onSelect?: () => void;
}

export const ChatList = ({ onSelect }: ChatListProps) => {
  const {
    customers,
    conversations,
    activeCustomerId,
    searchQuery,
    setActiveCustomer,
    setSearchQuery,
  } = useChatStore();

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const getLastMessage = (customerId: string) => {
    const msgs = conversations[customerId];
    return msgs?.[msgs.length - 1];
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'high-intent':
        return 'bg-success';
      case 'vip':
        return 'bg-accent';
      case 'new':
        return 'bg-primary';
      default:
        return 'bg-muted-foreground';
    }
  };

  return (
    <div className="flex w-full flex-col h-full bg-card border-r border-border">
      {/* Search */}
      <div className="p-4 border-b border-border flex flex-col w-full md:w-80 lg:w-96">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Customer List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredCustomers.map((customer, index) => {
          const lastMessage = getLastMessage(customer.id);
          const isActive = activeCustomerId === customer.id;

          return (
            <motion.button
              key={customer.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                setActiveCustomer(customer.id);
                onSelect?.();
              }}
              className={cn(
                'w-full md:w-80 lg:w-96 flex items-start gap-3 p-4 text-left transition-colors border-b border-border/50',
                isActive
                  ? 'bg-primary/5 border-l-2 border-l-primary'
                  : 'hover:bg-muted/50'
              )}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-bold text-muted-foreground">
                    {customer.name.charAt(0)}
                  </span>
                </div>
                <div
                  className={cn(
                    'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card',
                    customer.online ? 'bg-online' : 'bg-offline'
                  )}
                />
                {/* Tag indicator */}
                <div
                  className={cn(
                    'absolute -top-0.5 -left-0.5 w-3 h-3 rounded-full border-2 border-card',
                    getTagColor(customer.tag)
                  )}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-foreground truncate">
                    {customer.name}
                  </span>
                  {lastMessage && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      {dayjs(lastMessage.timestamp).fromNow(true)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <p className="text-sm text-muted-foreground truncate">
                    {lastMessage?.text || 'No messages yet'}
                  </p>
                  {customer.unreadCount > 0 && (
                    <span className="shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {customer.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}

        {filteredCustomers.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <p>No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

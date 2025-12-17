import { motion } from 'framer-motion';
import { Check, CheckCheck, Bot, ShieldCheck, User } from 'lucide-react';
import { Message } from '@/mock/messages';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isCustomer = message.sender === 'customer';
  const isBot = message.sender === 'bot';

  const getStatusIcon = () => {
    if (isCustomer) return null;
    
    const iconClass = cn(
      'w-4 h-4',
      isBot ? 'text-primary-foreground/70' : 'text-primary-foreground/70'
    );

    if (message.status === 'read') {
      return <CheckCheck className={cn(iconClass, isBot && 'text-accent')} />;
    }
    if (message.status === 'delivered') {
      return <CheckCheck className={iconClass} />;
    }
    return <Check className={iconClass} />;
  };

  const getSenderIcon = () => {
    if (isBot) {
      return (
        <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <Bot className="w-3 h-3 text-primary-foreground" />
        </div>
      );
    }
    if (!isCustomer) {
      return (
        <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <ShieldCheck className="w-3 h-3 text-primary-foreground" />
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex gap-2 mb-3',
        isCustomer ?  "justify-start" : "justify-end"
      )}
    >
      {isCustomer && (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mb-1">
          <span className="text-xs font-bold text-muted-foreground"><User size={16} className="text-black" /></span>
        </div>
      )}
      <div className={cn("max-w-[70%]", isCustomer ? "order-1" : "order-0")}>
      <div
        className={cn(
          'rounded-2xl px-4 py-3 shadow-sm w-fit',
          isCustomer
            ? 'bg-chat-customer text-foreground rounded-bl-md'
            : isBot
            ? 'bg-chat-bot text-primary-foreground rounded-br-md'
            : 'bg-chat-admin text-primary-foreground rounded-br-md'
        )}
      >
       
        {!isCustomer && (
          <div className="flex items-center gap-2 mb-1">
            {getSenderIcon()}
            <span className="text-xs font-medium opacity-80">
              {isBot ? 'Bot' : 'Admin'}
            </span>
          </div>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <div className={cn(
          'flex items-center gap-1 mt-1',
          isCustomer ? 'justify-start' : 'justify-end'
        )}>
          <span className={cn(
            'text-xs',
            isCustomer ? 'text-muted-foreground' : 'opacity-70'
          )}>
            {dayjs(message.timestamp).format('h:mm A')}
          </span>
           {getStatusIcon()}
          </div>
          

        </div>
      </div>
    </motion.div>
  );
};

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { BotToggle } from './BotToggle';
import { Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ChatWindowProps {
  onBack?: () => void;
}

export const ChatWindow = ({ onBack }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    activeCustomerId,
    customers,
    conversations,
    isTyping,
    isBotActive,
    sendMessage,
  } = useChatStore();

  const activeCustomer = customers.find((c) => c.id === activeCustomerId);
  const messages = activeCustomerId ? conversations[activeCustomerId] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    sendMessage(text, isBotActive ? 'bot' : 'admin');
  };

  if (!activeCustomer) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">Select a conversation</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a customer from the list to start chatting
          </p>
        </div>
      </div>
    );
  }

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'high-intent':
        return 'bg-success/20 text-success';
      case 'vip':
        return 'bg-accent/20 text-accent';
      case 'new':
        return 'bg-primary/20 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[100%] w-80">
      {/* Header */}
      <div className="bg-card border-b border-border px-1 dark:bg-slate-900 md:px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-bold text-muted-foreground">
                  {activeCustomer.name.charAt(0)}
                </span>
              </div>
              <div
                className={cn(
                  'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card',
                  activeCustomer.online ? 'bg-online' : 'bg-offline'
                )}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{window.innerWidth <= 640 ? activeCustomer.name.slice(0, 7)+'...' :activeCustomer.name}</h3>
                <span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', getTagColor(activeCustomer.tag))}>
                  {activeCustomer.tag.replace('-', ' ')}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {activeCustomer.online ? 'Online' : 'Last seen recently'}
              </p>
            </div>
          </div>
                  
          <div className="flex items-center gap-2">
            <BotToggle />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator sender={isBotActive ? 'bot' : 'admin'} />}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} />
    </div>
  );
};

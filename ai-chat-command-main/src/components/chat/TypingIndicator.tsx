import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const TypingIndicator = ({ sender }: { sender: 'bot' | 'admin' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={cn(
        'flex items-center gap-2 px-4 py-3 rounded-2xl w-fit',
        sender === 'bot' ? 'bg-chat-bot text-primary-foreground' : 'bg-chat-admin text-primary-foreground'
      )}
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-current opacity-70"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      <span className="text-sm">
        {sender === 'bot' ? 'Bot' : 'Admin'} is typing...
      </span>
    </motion.div>
  );
};

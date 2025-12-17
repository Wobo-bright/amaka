import { useState, KeyboardEvent } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { quickReplies } from '@/mock/messages';

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const MessageInput = ({ onSend, disabled }: MessageInputProps) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-card p-4 space-y-3">
      {/* Quick Replies */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {quickReplies.map((reply) => (
          <motion.button
            key={reply}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setText(reply)}
            className="px-3 py-1.5 text-xs font-medium bg-muted text-muted-foreground rounded-full whitespace-nowrap hover:bg-primary/10 hover:text-primary transition-colors"
          >
            {reply}
          </motion.button>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex items-end gap-2">
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Paperclip className="w-5 h-5" />
        </button>
        
        <div className="flex-1">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[40px] max-h-30 resize-none border-0 bg-muted focus-visible:ring-1 scrollbar-thin focus-visible:ring-primary"
            rows={1}
            disabled={disabled}
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          size="icon"
          className="h-11 w-11 rounded-full shrink-0"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center hidden lg:block">
        Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono">Enter</kbd> to send, 
        <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono ml-1">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
};

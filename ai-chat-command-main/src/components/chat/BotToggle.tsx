import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { useChatStore } from '@/store/chatStore';
import { useThemeStore } from '@/store/themeStore';

export const BotToggle = () => {
  const { isBotActive, toggleBot } = useChatStore();
  const { settings } = useThemeStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center gap-3 px-4 py-2 rounded-full transition-colors',
        isBotActive ? 'bg-primary/10' : 'bg-muted'
      )}
    >
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
        isBotActive ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
      )}>
        {isBotActive ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      
      <div className="hidden sm:block md:hidden lg:block flex flex-col">
        <span className="text-sm font-medium">
          {isBotActive ? `${settings.botName} Active` : 'Manual Mode'}
        </span>
        <span className="text-xs text-muted-foreground">
          {isBotActive ? ' Bot handling messages' : ' Admin in control'}
        </span>
      </div>

      <Switch
        checked={isBotActive}
        onCheckedChange={toggleBot}
        className="ml-2"
      />
    </motion.div>
  );
};

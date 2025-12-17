import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useChatStore } from '@/store/chatStore';

const Chat = () => {
  const [showChat, setShowChat] = useState(false);
  const activeCustomerId = useChatStore((state) => state.activeCustomerId);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-[calc(100vh-80px)] md:h-screen overflow-hidden"
      >
        {/* Chat List - Hidden on mobile when chat is open */}
        <div className={`${showChat ? 'hidden' : 'flex'} md:flex w-full md:w-80 lg:w-96 shrink-0`}>
          <ChatList onSelect={() => setShowChat(true)} />
        </div>

        {/* Chat Window - Full screen on mobile */}
        <div className={`${!showChat && !activeCustomerId ? 'hidden' : 'flex'} md:flex flex-1`}>
          <ChatWindow onBack={() => setShowChat(false)} />
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Chat;

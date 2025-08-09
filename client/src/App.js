import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';

function App() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch the list of all conversations
    const fetchChats = async () => {
      try {
        const response = await axios.get('https://whatappclone-9hmq.onrender.com/api/chats');
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    // Fetch messages for the selected chat
    if (selectedChat) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`https://whatappclone-9hmq.onrender.com/api/chats/${selectedChat._id}`);
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }
  }, [selectedChat]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || !selectedChat) return;

    const newMessage = {
      id: `demo-msg-${Date.now()}`,
      wa_id: selectedChat._id,
      text: messageText,
      from_me: true,
    };

    try {
      await axios.post('https://whatappclone-9hmq.onrender.com/api/messages', newMessage);
      // Update the UI with the new message
      setMessages(prevMessages => [...prevMessages, {
        ...newMessage,
        timestamp: new Date(),
        text: { body: messageText },
        statuses: [{ status: 'sent', timestamp: new Date() }]
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className={`app ${selectedChat ? 'chat-window-active' : ''}`}>
      <div className="chat-list">
        <ChatList chats={chats} onSelectChat={setSelectedChat} selectedChat={selectedChat} />
      </div>
      <div className="chat-window">
        {selectedChat ? (
          <ChatWindow
            messages={messages}
            selectedChat={selectedChat}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="no-chat-selected">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
}

export default App;
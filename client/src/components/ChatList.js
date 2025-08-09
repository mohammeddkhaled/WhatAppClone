import React from 'react';
import moment from 'moment';

const ChatList = ({ chats, onSelectChat, selectedChat }) => {
  return (
    <div className="chat-list-container">
      <div className="chat-list-header">Chats</div>
      <div className="chat-list-items">
        {chats.map(chat => (
          <div
            key={chat._id}
            className={`chat-list-item ${selectedChat && selectedChat._id === chat._id ? 'selected' : ''}`}
            onClick={() => onSelectChat(chat)}
          >
            <div className="chat-list-item-info">
              <div className="chat-list-item-name">{chat._id}</div>
              <div className="chat-list-item-last-message">{chat.lastMessage}</div>
            </div>
            <div className="chat-list-item-timestamp">
              {moment(chat.lastTimestamp).format('h:mm A')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
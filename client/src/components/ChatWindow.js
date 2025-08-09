import React, { useState } from 'react';
import moment from 'moment';

const ChatWindow = ({ messages, selectedChat, onSendMessage }) => {
  const [messageText, setMessageText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(messageText);
    setMessageText('');
  };

  const getStatusIcon = (statuses) => {
    const statusMap = {};
    statuses.forEach(s => statusMap[s.status] = true);
    if (statusMap.read) {
      return '✓✓'; // Read (double checkmark)
    } else if (statusMap.delivered) {
      return '✓✓'; // Delivered (double checkmark)
    } else if (statusMap.sent) {
      return '✓'; // Sent (single checkmark)
    }
    return '';
  };

  return (
    <div className="chat-window-container">
      <div className="chat-window-header">
        <div className="chat-window-name">{selectedChat._id}</div>
        <div className="chat-window-number">{selectedChat._id}</div>
      </div>
      <div className="message-list">
        {messages.map((message, index) => (
          <div key={index} className={`message-bubble ${message.from_me ? 'outgoing' : 'incoming'}`}>
            <p className="message-body">{message.text.body}</p>
            <span className="message-timestamp">{moment(message.timestamp).format('h:mm A')}</span>
            {message.from_me && (
              <span className="message-status">{getStatusIcon(message.statuses || [])}</span>
            )}
          </div>
        ))}
      </div>
      <form className="message-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="message-input-box"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button type="submit" className="message-send-button">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
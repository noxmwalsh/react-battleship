import React from 'react';
import { useSelector } from 'react-redux';
import './Messages.css';

const Messages = () => {
  const { messages } = useSelector(state => state.game);

  return (
    <div className="messages-container">
      <h3>Game Messages</h3>
      <div className="messages-list">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages; 
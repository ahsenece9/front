import React, { useState, useEffect, useRef } from 'react';
import { Send, MoreVertical, Phone, Video } from 'lucide-react';
import '../styles/Chat.css';

const ChatWindow = ({ friend, messages, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        onSendMessage(newMessage);
        setNewMessage('');
    };

    if (!friend) {
        return (
            <div className="chat-window" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                    <h3>Bir sohbet seçin veya yeni bir kişi ekleyin.</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="friend-avatar">
                    {friend.avatar}
                    <div className={`status-indicator ${friend.online ? 'status-online' : 'status-offline'}`}></div>
                </div>
                <div style={{ flex: 1 }}>
                    <div className="friend-name">{friend.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {friend.online ? 'Çevrimiçi' : 'Çevrimdışı'}
                    </div>
                </div>
                <div className="icon-btn"><Phone size={20} /></div>
                <div className="icon-btn"><Video size={20} /></div>
                <div className="icon-btn"><MoreVertical size={20} /></div>
            </div>

            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                        {msg.text}
                        <div className="message-time">{msg.time}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <form onSubmit={handleSend} className="chat-input-wrapper">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Bir mesaj yazın..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="send-btn">
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;

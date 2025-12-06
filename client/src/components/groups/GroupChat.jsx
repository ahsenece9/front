import React, { useState } from 'react';
import ChatWindow from '../ChatWindow'; // Reusing ChatWindow logic
import '../../styles/Chat.css';

const GroupChat = ({ group, currentUser }) => {
    // Mock messages for group
    const [messages, setMessages] = useState([
        { id: 1, text: 'Herkese merhaba! Proje ne durumda?', sender: 'other', senderName: 'Ali', time: '10:00' },
        { id: 2, text: 'Ben tasarım kısmını bitirdim.', sender: 'me', time: '10:05' },
        { id: 3, text: 'Süper! Ben de backend tarafına bakıyorum.', sender: 'other', senderName: 'Zeynep', time: '10:10' },
    ]);

    const handleSendMessage = (text) => {
        const newMessage = {
            id: Date.now(),
            text,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, newMessage]);
    };

    // Adapt ChatWindow to support sender names in group chat
    // Note: We might need to modify ChatWindow slightly or create a specific GroupChatWindow if the UI diverges too much.
    // For now, we'll use a slightly modified structure here directly since ChatWindow expects a 'friend' object.

    return (
        <div className="chat-window" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                        {msg.sender !== 'me' && <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', marginBottom: '2px' }}>{msg.senderName}</div>}
                        {msg.text}
                        <div className="message-time">{msg.time}</div>
                    </div>
                ))}
            </div>

            <div className="chat-input-area">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(e.target.elements.msg.value); e.target.elements.msg.value = ''; }} className="chat-input-wrapper">
                    <input name="msg" type="text" className="chat-input" placeholder="Gruba mesaj yaz..." />
                    <button type="submit" className="send-btn">Send</button>
                </form>
            </div>
        </div>
    );
};

export default GroupChat;

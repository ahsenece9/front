import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Send, Users } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || '';

const ChatPage = () => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Connect to Socket.IO
    useEffect(() => {
        if (!user) return;

        const socketUrl = API_URL || window.location.origin;
        const newSocket = io(socketUrl, {
            transports: ['websocket', 'polling']
        });
        
        newSocket.on('connect', () => {
            console.log('Connected to socket:', newSocket.id);
            setIsConnected(true);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            setIsConnected(false);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, [user]);

    // Fetch messages and listen for new ones
    useEffect(() => {
        if (!socket || !user) return;

        // Fetch initial messages
        const token = localStorage.getItem('token');
        fetch(`${API_URL}/api/messages`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                const formatted = data.map(msg => ({
                    id: msg.id,
                    content: msg.content,
                    senderId: msg.sender_id,
                    senderName: msg.sender_name,
                    time: new Date(msg.created_at).toLocaleTimeString('tr-TR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    }),
                    isMe: msg.sender_id === user.id
                }));
                setMessages(formatted);
            })
            .catch(err => console.error('Failed to load messages:', err));

        // Listen for new messages
        socket.on('receive_message', (message) => {
            const formattedMsg = {
                id: message.id,
                content: message.content,
                senderId: message.sender_id,
                senderName: message.sender_name,
                time: new Date(message.created_at).toLocaleTimeString('tr-TR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                }),
                isMe: message.sender_id === user.id
            };
            setMessages((prev) => [...prev, formattedMsg]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [socket, user]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        
        if (!socket || !user || !inputMessage.trim()) return;

        socket.emit('send_message', {
            sender_id: user.id,
            sender_name: user.full_name || user.email,
            content: inputMessage.trim()
        });

        setInputMessage('');
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Lütfen giriş yapın...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            <Users size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                                Genel Sohbet
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {isConnected ? (
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        Çevrimiçi
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                        Bağlantı kuruluyor...
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {messages.length} mesaj
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <Users size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">
                                Henüz mesaj yok. İlk mesajı siz gönderin! 👋
                            </p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                                msg.isMe ? 'order-2' : 'order-1'
                            }`}>
                                {!msg.isMe && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-3">
                                        {msg.senderName}
                                    </p>
                                )}
                                <div className={`rounded-2xl px-4 py-3 ${
                                    msg.isMe
                                        ? 'bg-purple-500 text-white rounded-br-none'
                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-none'
                                }`}>
                                    <p className="break-words">{msg.content}</p>
                                    <p className={`text-xs mt-1 ${
                                        msg.isMe 
                                            ? 'text-purple-100' 
                                            : 'text-gray-400 dark:text-gray-500'
                                    }`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Bir mesaj yazın..."
                        className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={!isConnected}
                    />
                    <button
                        type="submit"
                        disabled={!isConnected || !inputMessage.trim()}
                        className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-full font-medium transition-colors flex items-center gap-2"
                    >
                        <Send size={20} />
                        Gönder
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import UserSearchModal from '../components/UserSearchModal';
import '../styles/Chat.css';

const ChatPage = () => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [friends, setFriends] = useState([]); // In a real app, fetch friends/users
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [filter, setFilter] = useState('all');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Temporary: Mock friends until we implement friend system fully
    // In a real scenario, we would fetch users from /api/users
    useEffect(() => {
        setFriends([
            { id: 999, name: 'Genel Sohbet', avatar: 'GS', online: true, lastMessage: 'Hoşgeldiniz!' }
        ]);
        setSelectedFriend({ id: 999, name: 'Genel Sohbet', avatar: 'GS', online: true });
    }, []);

    useEffect(() => {
        const newSocket = io('/', {
            path: '/socket.io',
        });
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (!socket) return;

        // Fetch initial messages
        fetch('/api/messages')
            .then(res => res.json())
            .then(data => {
                // Transform to match UI expected format if needed
                const formatted = data.map(msg => ({
                    id: msg.id,
                    text: msg.content,
                    sender: msg.sender_id === user?.id ? 'me' : 'other',
                    senderName: msg.sender_name,
                    time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));
                setMessages(formatted);
            });

        socket.on('receive_message', (message) => {
            const formattedMsg = {
                id: message.id,
                text: message.content,
                sender: message.sender_id === user?.id ? 'me' : 'other',
                senderName: message.sender_name,
                time: new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, formattedMsg]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [socket, user]);

    const handleSendMessage = (text) => {
        if (!socket || !user) return;

        socket.emit('send_message', {
            sender_id: user.id,
            sender_name: user.full_name,
            sender_avatar: user.avatar_url,
            content: text
        });
    };

    return (
        <div className="chat-container">
            <ChatList
                friends={friends}
                selectedFriendId={selectedFriend?.id}
                onSelectFriend={setSelectedFriend}
                filter={filter}
                onSetFilter={setFilter}
                onOpenSearch={() => setIsSearchOpen(true)}
            />

            <ChatWindow
                friend={selectedFriend}
                messages={messages}
                onSendMessage={handleSendMessage}
            />

            <UserSearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </div>
    );
};

export default ChatPage;

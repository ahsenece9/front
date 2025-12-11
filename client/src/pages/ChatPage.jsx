import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    Send, Search, MessageCircle, Users, Circle,
    Smile, ArrowLeft, Star, Phone, Video, Check
} from 'lucide-react';
import '../styles/Chat.css';

const ChatPage = () => {
    const { user } = useAuth();
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [messages, setMessages] = useState({});
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Mock friends data
    const [friends, setFriends] = useState([
        { id: 'f1', name: 'Ali Yılmaz', username: 'aliyilmaz', avatar: 'AY', online: true, lastMessage: 'Merhaba!', lastMessageTime: new Date(), unread: 2, isFavorite: true },
        { id: 'f2', name: 'Zeynep Demir', username: 'zeynepd', avatar: 'ZD', online: true, lastMessage: 'Proje nasıl gidiyor?', lastMessageTime: new Date(Date.now() - 3600000), unread: 0, isFavorite: false },
        { id: 'f3', name: 'Mehmet Kaya', username: 'mehmetk', avatar: 'MK', online: false, lastMessage: 'Görüşürüz!', lastMessageTime: new Date(Date.now() - 86400000), unread: 0, isFavorite: true },
        { id: 'f4', name: 'Ayşe Çelik', username: 'aysecelik', avatar: 'AÇ', online: true, lastMessage: 'Teşekkürler 😊', lastMessageTime: new Date(Date.now() - 7200000), unread: 1, isFavorite: false },
        { id: 'f5', name: 'Can Yıldız', username: 'canyildiz', avatar: 'CY', online: false, lastMessage: 'Tamam, anlaştık!', lastMessageTime: new Date(Date.now() - 172800000), unread: 0, isFavorite: false },
    ]);

    // Initialize mock messages
    useEffect(() => {
        const mockMessages = {
            'f1': [
                { id: 1, content: 'Selam!', senderId: 'f1', time: '10:30', isMe: false },
                { id: 2, content: 'Selam, nasılsın?', senderId: 'me', time: '10:31', isMe: true },
                { id: 3, content: 'İyiyim, sen?', senderId: 'f1', time: '10:32', isMe: false },
                { id: 4, content: 'Merhaba!', senderId: 'f1', time: '10:35', isMe: false },
            ],
            'f2': [
                { id: 1, content: 'Proje nasıl gidiyor?', senderId: 'f2', time: '09:00', isMe: false },
            ],
            'f4': [
                { id: 1, content: 'Yardımın için teşekkürler!', senderId: 'me', time: '14:20', isMe: true },
                { id: 2, content: 'Teşekkürler 😊', senderId: 'f4', time: '14:25', isMe: false },
            ]
        };
        setMessages(mockMessages);
    }, []);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedFriend]);

    // Send message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !selectedFriend) return;

        const newMessage = {
            id: Date.now(),
            content: inputMessage.trim(),
            senderId: 'me',
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };

        setMessages(prev => ({
            ...prev,
            [selectedFriend.id]: [...(prev[selectedFriend.id] || []), newMessage]
        }));

        setFriends(prev => prev.map(f =>
            f.id === selectedFriend.id
                ? { ...f, lastMessage: inputMessage.trim(), lastMessageTime: new Date(), unread: 0 }
                : f
        ));

        setInputMessage('');
    };

    // Filter Logic
    const filteredFriends = friends.filter(f => {
        const matchesFilter = filter === 'all' ||
            (filter === 'online' && f.online) ||
            (filter === 'favorites' && f.isFavorite);
        const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.username.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Get time ago text
    const getTimeAgo = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (minutes < 1) return 'Şimdi';
        if (minutes < 60) return `${minutes}d`;
        if (hours < 24) return `${hours}s`;
        return `${days}g`;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    if (!user) {
        return (
            <div className="dashboard-home" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <MessageCircle size={64} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
                    <h2 style={{ color: 'var(--text-main)' }}>Giriş Yapın</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Sohbetlere erişmek için lütfen giriş yapın</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="dashboard-home"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div className="welcome-section" variants={itemVariants} style={{ marginBottom: '2rem' }}>
                <div className="welcome-text">
                    <h1>
                        <MessageCircle size={40} style={{ verticalAlign: 'middle', marginRight: '12px' }} />
                        Sohbetler
                    </h1>
                    <p>Arkadaşlarınızla mesajlaşın</p>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="dashboard-content-row">
                {/* Friends List */}
                <motion.div className="dashboard-card" variants={itemVariants} style={{ flex: 1 }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Arkadaşlar</h3>

                        {/* Search */}
                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Sohbet ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 10px 10px 40px',
                                    background: 'var(--bg-input)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--text-main)'
                                }}
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => setFilter('all')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    background: filter === 'all' ? 'var(--color-primary)' : 'var(--bg-input)',
                                    color: filter === 'all' ? 'white' : 'var(--text-main)',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 500
                                }}
                            >
                                Tümü
                            </button>
                            <button
                                onClick={() => setFilter('online')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    background: filter === 'online' ? 'var(--color-primary)' : 'var(--bg-input)',
                                    color: filter === 'online' ? 'white' : 'var(--text-main)',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <Circle size={8} fill="#22c55e" color="#22c55e" />
                                Çevrimiçi
                            </button>
                            <button
                                onClick={() => setFilter('favorites')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    background: filter === 'favorites' ? 'var(--color-primary)' : 'var(--bg-input)',
                                    color: filter === 'favorites' ? 'white' : 'var(--text-main)',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <Star size={14} fill={filter === 'favorites' ? 'white' : 'none'} />
                                Favoriler
                            </button>
                        </div>
                    </div>

                    {/* Friends */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '500px', overflowY: 'auto' }}>
                        {filteredFriends.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                <Users size={40} style={{ marginBottom: '0.5rem' }} />
                                <p>{filter === 'online' ? 'Çevrimiçi arkadaş yok' : 'Sohbet bulunamadı'}</p>
                            </div>
                        ) : (
                            filteredFriends.map(friend => (
                                <motion.div
                                    key={friend.id}
                                    whileHover={{ scale: 1.02, backgroundColor: 'var(--bg-hover)' }}
                                    onClick={() => {
                                        setSelectedFriend(friend);
                                        setFriends(prev => prev.map(f =>
                                            f.id === friend.id ? { ...f, unread: 0 } : f
                                        ));
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        background: selectedFriend?.id === friend.id ? 'var(--bg-hover)' : 'transparent',
                                        border: selectedFriend?.id === friend.id ? '1px solid var(--color-primary)' : '1px solid transparent'
                                    }}
                                >
                                    <div style={{ position: 'relative' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 600
                                        }}>
                                            {friend.avatar}
                                        </div>
                                        {friend.online && (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                width: '12px',
                                                height: '12px',
                                                background: '#22c55e',
                                                border: '2px solid var(--bg-card)',
                                                borderRadius: '50%'
                                            }} />
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{friend.name}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {getTimeAgo(friend.lastMessageTime)}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                                            <span style={{
                                                fontSize: '0.875rem',
                                                color: 'var(--text-muted)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {friend.lastMessage}
                                            </span>
                                            {friend.unread > 0 && (
                                                <span style={{
                                                    background: 'var(--color-primary)',
                                                    color: 'white',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 700,
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    {friend.unread}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Chat Window */}
                <motion.div className="dashboard-card" variants={itemVariants} style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '600px' }}>
                    {!selectedFriend ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                            <MessageCircle size={80} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Sohbet Seçin</h3>
                            <p>Mesajlaşmaya başlamak için bir sohbet seçin</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingBottom: '1rem',
                                borderBottom: '1px solid var(--border-color)',
                                marginBottom: '1rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 600
                                        }}>
                                            {selectedFriend.avatar}
                                        </div>
                                        {selectedFriend.online && (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                width: '12px',
                                                height: '12px',
                                                background: '#22c55e',
                                                border: '2px solid var(--bg-card)',
                                                borderRadius: '50%'
                                            }} />
                                        )}
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '2px', color: 'var(--text-main)' }}>{selectedFriend.name}</h4>
                                        <span style={{ fontSize: '0.875rem', color: selectedFriend.online ? '#22c55e' : 'var(--text-muted)' }}>
                                            {selectedFriend.online ? 'Çevrimiçi' : 'Çevrimdışı'}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button style={{
                                        padding: '8px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--bg-input)',
                                        color: 'var(--text-main)',
                                        cursor: 'pointer'
                                    }} title="Sesli Arama">
                                        <Phone size={20} />
                                    </button>
                                    <button style={{
                                        padding: '8px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--bg-input)',
                                        color: 'var(--text-main)',
                                        cursor: 'pointer'
                                    }} title="Görüntülü Arama">
                                        <Video size={20} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFriends(prev => prev.map(f =>
                                                f.id === selectedFriend.id ? { ...f, isFavorite: !f.isFavorite } : f
                                            ));
                                            setSelectedFriend(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
                                        }}
                                        style={{
                                            padding: '8px',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--bg-input)',
                                            color: selectedFriend.isFavorite ? '#fbbf24' : 'var(--text-main)',
                                            cursor: 'pointer'
                                        }}
                                        title={selectedFriend.isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                                    >
                                        <Star size={20} fill={selectedFriend.isFavorite ? '#fbbf24' : 'none'} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '1rem 0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                {(messages[selectedFriend.id] || []).map(msg => (
                                    <div
                                        key={msg.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: msg.isMe ? 'flex-end' : 'flex-start'
                                        }}
                                    >
                                        <div style={{
                                            maxWidth: '70%',
                                            padding: '12px 16px',
                                            borderRadius: 'var(--radius-md)',
                                            background: msg.isMe
                                                ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                                                : 'var(--bg-input)',
                                            color: msg.isMe ? 'white' : 'var(--text-main)'
                                        }}>
                                            <p style={{ marginBottom: '4px' }}>{msg.content}</p>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                opacity: 0.7
                                            }}>
                                                {msg.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSendMessage} style={{
                                display: 'flex',
                                gap: '8px',
                                paddingTop: '1rem',
                                borderTop: '1px solid var(--border-color)'
                            }}>
                                <button
                                    type="button"
                                    style={{
                                        padding: '10px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--bg-input)',
                                        color: 'var(--text-main)',
                                        cursor: 'pointer'
                                    }}
                                    title="Emoji"
                                >
                                    <Smile size={20} />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Mesaj yazın..."
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    style={{
                                        flex: 1,
                                        padding: '10px 16px',
                                        background: 'var(--bg-input)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--text-main)'
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={!inputMessage.trim()}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: 'var(--radius-md)',
                                        border: 'none',
                                        background: inputMessage.trim()
                                            ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                                            : 'var(--bg-input)',
                                        color: 'white',
                                        cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontWeight: 500
                                    }}
                                >
                                    <Send size={18} />
                                    Gönder
                                </button>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ChatPage;

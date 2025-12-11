import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    Send, Search, Users, Plus, Circle,
    Smile, Crown, Star, UserPlus, Settings, Shield
} from 'lucide-react';
import '../styles/Chat.css';

const GroupsPage = () => {
    const { user } = useAuth();
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [messages, setMessages] = useState({});
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Mock groups data
    const [groups, setGroups] = useState([
        {
            id: 'g1',
            name: 'Proje Ekibi',
            description: 'Ana proje geliştirme grubu',
            avatar: 'PE',
            memberCount: 5,
            onlineCount: 3,
            lastMessage: 'Toplantı yarın saat 10:00',
            lastMessageTime: new Date(),
            lastMessageSender: 'Ali',
            unread: 3,
            isAdmin: true,
            isPinned: true
        },
        {
            id: 'g2',
            name: 'Yazılım Takımı',
            description: 'Yazılım geliştirme ekibi',
            avatar: 'YT',
            memberCount: 8,
            onlineCount: 5,
            lastMessage: 'Kod incelemesi tamamlandı',
            lastMessageTime: new Date(Date.now() - 3600000),
            lastMessageSender: 'Zeynep',
            unread: 0,
            isAdmin: false,
            isPinned: false
        },
        {
            id: 'g3',
            name: 'Tasarım Grubu',
            description: 'UI/UX tasarım ekibi',
            avatar: 'TG',
            memberCount: 4,
            onlineCount: 2,
            lastMessage: 'Yeni mockup hazır!',
            lastMessageTime: new Date(Date.now() - 86400000),
            lastMessageSender: 'Ayşe',
            unread: 1,
            isAdmin: true,
            isPinned: true
        },
        {
            id: 'g4',
            name: 'Genel',
            description: 'Genel sohbet',
            avatar: 'GN',
            memberCount: 12,
            onlineCount: 7,
            lastMessage: 'Kahve molası! ☕',
            lastMessageTime: new Date(Date.now() - 7200000),
            unread: 5,
            isAdmin: false,
            isPinned: false
        }
    ]);

    // Initialize mock messages
    useEffect(() => {
        const mockMessages = {
            'g1': [
                { id: 1, content: 'Merhaba ekip!', sender: 'Ali', senderId: 'u1', time: '10:30', isMe: false },
                { id: 2, content: 'Selam Ali!', sender: 'Ben', senderId: 'me', time: '10:31', isMe: true },
                { id: 3, content: 'Bugünkü toplantı saat kaçta?', sender: 'Zeynep', senderId: 'u2', time: '10:32', isMe: false },
                { id: 4, content: 'Toplantı yarın saat 10:00', sender: 'Ali', senderId: 'u1', time: '10:35', isMe: false },
            ],
            'g2': [
                { id: 1, content: 'Kod incelemesi tamamlandı', sender: 'Zeynep', senderId: 'u2', time: '09:00', isMe: false },
            ],
            'g3': [
                { id: 1, content: 'Yeni mockup hazır!', sender: 'Ayşe', senderId: 'u3', time: '14:20', isMe: false },
                { id: 2, content: 'Harika görünüyor!', sender: 'Ben', senderId: 'me', time: '14:25', isMe: true },
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
    }, [messages, selectedGroup]);

    // Send message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !selectedGroup) return;

        const newMessage = {
            id: Date.now(),
            content: inputMessage.trim(),
            sender: user?.full_name || 'Ben',
            senderId: 'me',
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };

        setMessages(prev => ({
            ...prev,
            [selectedGroup.id]: [...(prev[selectedGroup.id] || []), newMessage]
        }));

        setGroups(prev => prev.map(g =>
            g.id === selectedGroup.id
                ? { ...g, lastMessage: inputMessage.trim(), lastMessageTime: new Date(), lastMessageSender: 'Ben', unread: 0 }
                : g
        ));

        setInputMessage('');
    };

    // Filter Logic
    const filteredGroups = groups.filter(g => {
        const matchesFilter = filter === 'all' ||
            (filter === 'pinned' && g.isPinned) ||
            (filter === 'admin' && g.isAdmin);
        const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.description.toLowerCase().includes(searchQuery.toLowerCase());
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
                    <Users size={64} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
                    <h2 style={{ color: 'var(--text-main)' }}>Giriş Yapın</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Gruplara erişmek için lütfen giriş yapın</p>
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
                        <Users size={40} style={{ verticalAlign: 'middle', marginRight: '12px' }} />
                        Gruplar
                    </h1>
                    <p>Grup sohbetlerinizi yönetin</p>
                </div>
                <button
                    style={{
                        padding: '12px 24px',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <Plus size={20} />
                    Yeni Grup Oluştur
                </button>
            </motion.div>

            {/* Main Content */}
            <div className="dashboard-content-row">
                {/* Groups List */}
                <motion.div className="dashboard-card" variants={itemVariants} style={{ flex: 1 }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Gruplarım</h3>

                        {/* Search */}
                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Grup ara..."
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
                                onClick={() => setFilter('pinned')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    background: filter === 'pinned' ? 'var(--color-primary)' : 'var(--bg-input)',
                                    color: filter === 'pinned' ? 'white' : 'var(--text-main)',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <Star size={14} fill={filter === 'pinned' ? 'white' : 'none'} />
                                Sabitlenmiş
                            </button>
                            <button
                                onClick={() => setFilter('admin')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    background: filter === 'admin' ? 'var(--color-primary)' : 'var(--bg-input)',
                                    color: filter === 'admin' ? 'white' : 'var(--text-main)',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <Shield size={14} />
                                Yöneticisi Olduğum
                            </button>
                        </div>
                    </div>

                    {/* Groups */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '500px', overflowY: 'auto' }}>
                        {filteredGroups.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                <Users size={40} style={{ marginBottom: '0.5rem' }} />
                                <p>Grup bulunamadı</p>
                            </div>
                        ) : (
                            filteredGroups.map(group => (
                                <motion.div
                                    key={group.id}
                                    whileHover={{ scale: 1.02, backgroundColor: 'var(--bg-hover)' }}
                                    onClick={() => {
                                        setSelectedGroup(group);
                                        setGroups(prev => prev.map(g =>
                                            g.id === group.id ? { ...g, unread: 0 } : g
                                        ));
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        background: selectedGroup?.id === group.id ? 'var(--bg-hover)' : 'transparent',
                                        border: selectedGroup?.id === group.id ? '1px solid var(--color-primary)' : '1px solid transparent'
                                    }}
                                >
                                    <div>
                                        <div style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: 'var(--radius-md)',
                                            background: 'linear-gradient(135deg, var(--color-success), var(--color-warning))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: '1.25rem'
                                        }}>
                                            {group.avatar}
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{group.name}</span>
                                            {group.isAdmin && (
                                                <Crown size={14} style={{ color: 'var(--color-warning)' }} />
                                            )}
                                            {group.isPinned && (
                                                <Star size={14} style={{ color: 'var(--color-accent)', fill: 'var(--color-accent)' }} />
                                            )}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                            <Circle size={8} fill="#22c55e" color="#22c55e" style={{ display: 'inline', marginRight: '4px' }} />
                                            {group.onlineCount}/{group.memberCount} üye çevrimiçi
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{
                                                fontSize: '0.875rem',
                                                color: 'var(--text-muted)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                <strong>{group.lastMessageSender}:</strong> {group.lastMessage}
                                            </span>
                                            {group.unread > 0 && (
                                                <span style={{
                                                    background: 'var(--color-primary)',
                                                    color: 'white',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 700,
                                                    minWidth: '20px',
                                                    height: '20px',
                                                    borderRadius: '10px',
                                                    padding: '0 6px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    {group.unread}
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
                    {!selectedGroup ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                            <Users size={80} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Grup Seçin</h3>
                            <p>Mesajlaşmaya başlamak için bir grup seçin</p>
                        </div>
                    ) : (
                        <>
                            {/* Group Header */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingBottom: '1rem',
                                borderBottom: '1px solid var(--border-color)',
                                marginBottom: '1rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'linear-gradient(135deg, var(--color-success), var(--color-warning))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 700
                                    }}>
                                        {selectedGroup.avatar}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                            <h4 style={{ color: 'var(--text-main)' }}>{selectedGroup.name}</h4>
                                            {selectedGroup.isAdmin && (
                                                <Crown size={16} style={{ color: 'var(--color-warning)' }} />
                                            )}
                                        </div>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            <Circle size={8} fill="#22c55e" color="#22c55e" style={{ display: 'inline', marginRight: '4px' }} />
                                            {selectedGroup.onlineCount} üye çevrimiçi
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
                                    }} title="Üye Ekle">
                                        <UserPlus size={20} />
                                    </button>
                                    {selectedGroup.isAdmin && (
                                        <button style={{
                                            padding: '8px',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--bg-input)',
                                            color: 'var(--text-main)',
                                            cursor: 'pointer'
                                        }} title="Grup Ayarları">
                                            <Settings size={20} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setGroups(prev => prev.map(g =>
                                                g.id === selectedGroup.id ? { ...g, isPinned: !g.isPinned } : g
                                            ));
                                            setSelectedGroup(prev => ({ ...prev, isPinned: !prev.isPinned }));
                                        }}
                                        style={{
                                            padding: '8px',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--bg-input)',
                                            color: selectedGroup.isPinned ? 'var(--color-accent)' : 'var(--text-main)',
                                            cursor: 'pointer'
                                        }}
                                        title={selectedGroup.isPinned ? 'Sabitlemeyi Kaldır' : 'Sabitle'}
                                    >
                                        <Star size={20} fill={selectedGroup.isPinned ? 'var(--color-accent)' : 'none'} />
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
                                {(messages[selectedGroup.id] || []).map(msg => (
                                    <div
                                        key={msg.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: msg.isMe ? 'flex-end' : 'flex-start'
                                        }}
                                    >
                                        <div style={{
                                            maxWidth: '70%'
                                        }}>
                                            {!msg.isMe && (
                                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '4px' }}>
                                                    {msg.sender}
                                                </div>
                                            )}
                                            <div style={{
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

export default GroupsPage;

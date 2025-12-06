import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, UserPlus } from 'lucide-react';
import '../styles/Calendar.css'; // Reusing modal styles
import '../styles/Chat.css';

const UserSearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    // Mock search function
    const handleSearch = () => {
        if (!query.trim()) return;

        // Mock results
        setResults([
            { id: 101, name: 'Mehmet Yılmaz', username: 'mehmet_y', avatar: 'MY' },
            { id: 102, name: 'Ayşe Demir', username: 'ayse_d', avatar: 'AD' },
            { id: 103, name: 'Caner Erkin', username: 'caner_e', avatar: 'CE' },
        ]);
    };

    const handleSendRequest = (userId) => {
        alert(`Arkadaşlık isteği gönderildi! (User ID: ${userId})`);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="calendar-modal search-modal-content"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-header">
                        <div className="modal-date">Yeni Kişi Ekle</div>
                        <div className="modal-close" onClick={onClose}>
                            <X size={24} />
                        </div>
                    </div>

                    <div className="modal-body" style={{ padding: '1.5rem' }}>
                        <div className="search-input-group">
                            <input
                                type="text"
                                className="modal-input"
                                placeholder="Kullanıcı adı girin..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button className="btn btn-primary" onClick={handleSearch}>
                                <Search size={20} />
                            </button>
                        </div>

                        <div className="search-result-list">
                            {results.length > 0 ? (
                                results.map(user => (
                                    <div key={user.id} className="search-result-item">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div className="friend-avatar" style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}>
                                                {user.avatar}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{user.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>@{user.username}</div>
                                            </div>
                                        </div>
                                        <div className="add-friend-btn" onClick={() => handleSendRequest(user.id)}>
                                            <UserPlus size={16} /> Ekle
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '1rem' }}>
                                    {query ? 'Kullanıcı bulunamadı.' : 'Aramak için bir kullanıcı adı girin.'}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UserSearchModal;

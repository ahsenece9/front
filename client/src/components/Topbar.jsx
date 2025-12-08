import React, { useState, useEffect } from 'react';
import { MessageCircle, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar3D from './avatar/Avatar3D';
import '../styles/Avatar3D.css';

const Topbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    // localStorage'dan avatar URL'sini yükle
    useEffect(() => {
        const savedAvatarUrl = localStorage.getItem('userAvatarUrl');
        if (savedAvatarUrl) {
            setAvatarUrl(savedAvatarUrl);
        }
        
        // Storage event listener - diğer tab'lardan gelen değişiklikleri dinle
        const handleStorageChange = (e) => {
            if (e.key === 'userAvatarUrl') {
                setAvatarUrl(e.newValue);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    // Kullanıcı adını ve baş harflerini al
    const displayName = user?.full_name || user?.name || user?.email?.split('@')[0] || 'Kullanıcı';
    const initials = displayName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="topbar">
            {/* Search bar placeholder or empty space */}
            <div className="search-bar" style={{ opacity: 0 }}></div>

            <div className="topbar-actions">
                <div className="icon-btn">
                    <MessageCircle size={20} />
                    <div className="badge">3</div>
                </div>
                <div className="icon-btn">
                    <Bell size={20} />
                    <div className="badge">5</div>
                </div>

                <div className="user-profile-container" style={{ position: 'relative' }}>
                    <div
                        className="user-profile"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {avatarUrl ? (
                            <div className="avatar avatar-3d-wrapper">
                                <Avatar3D 
                                    avatarUrl={avatarUrl} 
                                    size={40}
                                    autoRotate={true}
                                    interactionPrompt="none"
                                    className="avatar-3d-topbar avatar-3d-floating"
                                />
                            </div>
                        ) : (
                            <div className="avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{initials}</div>
                        )}
                        <div className="user-info">
                            <span className="user-name">{displayName}</span>
                            <span className="user-role">Öğrenci</span>
                        </div>
                        <ChevronDown size={16} style={{ transition: 'transform 0.2s', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                    </div>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                className="user-dropdown"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="dropdown-item" onClick={() => { navigate('/dashboard/profile'); setIsDropdownOpen(false); }}>
                                    <User size={16} /> Profil
                                </div>
                                <div className="dropdown-item" onClick={() => { navigate('/dashboard/settings'); setIsDropdownOpen(false); }}>
                                    <Settings size={16} /> Ayarlar
                                </div>
                                <div className="dropdown-divider"></div>
                                <div className="dropdown-item danger" onClick={handleLogout}>
                                    <LogOut size={16} /> Çıkış Yap
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
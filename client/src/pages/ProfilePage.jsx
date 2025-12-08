// src/pages/ProfilePage.jsx
// Profil sayfası - Ready Player Me avatar entegrasyonu ile güncellendi

import React, { useState, useEffect } from 'react';
import { User, Shield, CheckCircle, AlertCircle, Camera, Mail, Sparkles } from 'lucide-react';
import AvatarCreator from '../components/avatar/AvatarCreator';
import Avatar3D from '../components/avatar/Avatar3D';
import '../styles/Profile.css';
import '../styles/Avatar3D.css';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [avatarUrl, setAvatarUrl] = useState(null); // Ready Player Me GLB URL'si
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    
    const [user, setUser] = useState({
        name: 'Ahmet Yılmaz',
        username: 'ahmetyilmaz',
        email: 'ahmet@example.com',
        bio: 'Bilgisayar Mühendisliği öğrencisi. Yazılım ve tasarım meraklısı.',
        avatar: 'AY',
        verified: false
    });

    // localStorage'dan avatar URL'sini yükle
    useEffect(() => {
        const savedAvatarUrl = localStorage.getItem('userAvatarUrl');
        if (savedAvatarUrl) {
            setAvatarUrl(savedAvatarUrl);
        }
    }, []);

    // Avatar URL'si değiştiğinde localStorage'a kaydet
    useEffect(() => {
        if (avatarUrl) {
            localStorage.setItem('userAvatarUrl', avatarUrl);
        }
    }, [avatarUrl]);

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        alert('Profil bilgileri güncellendi!');
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            alert('Yeni şifreler eşleşmiyor!');
            return;
        }
        alert('Şifre başarıyla değiştirildi!');
        setPasswords({ current: '', new: '', confirm: '' });
    };

    const handleSendVerification = () => {
        alert(`Doğrulama bağlantısı ${user.email} adresine gönderildi.`);
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Profil Ayarları</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Hesap bilgilerinizi ve tercihlerinizi yönetin.</p>
            </div>

            <div className="profile-tabs">
                <div
                    className={`profile-tab ${activeTab === 'general' ? 'active' : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={18} /> Genel
                    </div>
                </div>
                <div
                    className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveTab('security')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Shield size={18} /> Güvenlik
                    </div>
                </div>
                <div
                    className={`profile-tab ${activeTab === 'verification' ? 'active' : ''}`}
                    onClick={() => setActiveTab('verification')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={18} /> Doğrulama
                    </div>
                </div>
            </div>

            {activeTab === 'general' && (
                <div className="profile-section">
                    <h3>Kişisel Bilgiler</h3>

                    <div className="avatar-section">
                        <div className="profile-avatar-container">
                            {avatarUrl ? (
                                <>
                                    <div className="profile-avatar-large avatar-3d-profile-wrapper">
                                        <Avatar3D 
                                            avatarUrl={avatarUrl} 
                                            size={120}
                                            autoRotate={true}
                                            interactionPrompt="auto"
                                            className="avatar-3d-profile"
                                        />
                                    </div>
                                    <div className="avatar-info">
                                        <p className="avatar-name">{user.name}</p>
                                        <p className="avatar-url-hint">3D Avatar hazır ✓</p>
                                        <p className="avatar-hint-small">Döndürmek için sürükleyin</p>
                                    </div>
                                </>
                            ) : (
                                <>
                        <div className="profile-avatar-large">
                            {user.avatar}
                                    </div>
                                    <div className="avatar-info">
                                        <p className="avatar-name">{user.name}</p>
                                        <p className="avatar-placeholder">Henüz avatarın yok</p>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="avatar-actions">
                            <button 
                                className="btn btn-primary" 
                                style={{ fontSize: '0.9rem' }}
                                onClick={() => setIsAvatarModalOpen(true)}
                            >
                                <Sparkles size={16} style={{ marginRight: '6px' }} /> 
                                {avatarUrl ? 'Avatarı Değiştir' : 'Avatar Oluştur'}
                            </button>
                            {avatarUrl && (
                                <button 
                                    className="btn" 
                                    style={{ fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)' }}
                                    onClick={() => {
                                        setAvatarUrl(null);
                                        localStorage.removeItem('userAvatarUrl');
                                    }}
                                >
                                Kaldır
                            </button>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleUpdateProfile}>
                        <div className="form-group">
                            <label className="form-label">Ad Soyad</label>
                            <input
                                type="text"
                                className="form-input"
                                value={user.name}
                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Kullanıcı Adı</label>
                            <input
                                type="text"
                                className="form-input"
                                value={user.username}
                                onChange={(e) => setUser({ ...user, username: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Biyografi</label>
                            <textarea
                                className="form-input"
                                rows="3"
                                value={user.bio}
                                onChange={(e) => setUser({ ...user, bio: e.target.value })}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Değişiklikleri Kaydet</button>
                    </form>
                </div>
            )}

            {activeTab === 'security' && (
                <div className="profile-section">
                    <h3>Şifre Değiştir</h3>
                    <form onSubmit={handleChangePassword}>
                        <div className="form-group">
                            <label className="form-label">Mevcut Şifre</label>
                            <input
                                type="password"
                                className="form-input"
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Yeni Şifre</label>
                            <input
                                type="password"
                                className="form-input"
                                value={passwords.new}
                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Yeni Şifre (Tekrar)</label>
                            <input
                                type="password"
                                className="form-input"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Şifreyi Güncelle</button>
                    </form>
                </div>
            )}

            {activeTab === 'verification' && (
                <div className="profile-section">
                    <h3>Hesap Doğrulama</h3>

                    <div className={`verification-status ${user.verified ? 'status-verified' : 'status-unverified'}`}>
                        {user.verified ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {user.verified ? 'Hesabınız Doğrulandı' : 'Hesabınız Doğrulanmadı'}
                    </div>

                    <div className="form-group">
                        <label className="form-label">E-posta Adresi</label>
                        <input
                            type="email"
                            className="form-input"
                            value={user.email}
                            disabled
                        />
                    </div>

                    {!user.verified && (
                        <div>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                Hesabınızı güvende tutmak ve tüm özelliklere erişmek için e-posta adresinizi doğrulayın.
                            </p>
                            <button className="btn btn-primary" onClick={handleSendVerification}>
                                <Mail size={18} style={{ marginRight: '8px' }} /> Doğrulama E-postası Gönder
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Ready Player Me Avatar Creator Modal */}
            <AvatarCreator
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
                onAvatarReady={(url) => {
                    setAvatarUrl(url);
                    // TODO: İleride bu URL'yi backend'e kaydedebiliriz
                    console.log('Avatar URL kaydedildi:', url);
                }}
            />
        </div>
    );
};

export default ProfilePage;

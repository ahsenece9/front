import React from 'react';
import { Moon, Sun, Bell, Globe, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Profile.css'; // Reusing profile styles for consistency

const SettingsPage = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Uygulama Ayarları</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Görünüm ve uygulama tercihlerinizi özelleştirin.</p>
            </div>

            <div className="profile-section">
                <h3>Görünüm</h3>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--color-primary)'
                        }}>
                            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <div>
                            <div style={{ fontWeight: 500 }}>Tema Modu</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                {theme === 'dark' ? 'Koyu mod aktif' : 'Açık mod aktif'}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={toggleTheme}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--color-bg-alt)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {theme === 'dark' ? 'Açık Moda Geç' : 'Koyu Moda Geç'}
                    </button>
                </div>
            </div>

            <div className="profile-section">
                <h3>Diğer Ayarlar</h3>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--color-secondary)'
                        }}>
                            <Bell size={20} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 500 }}>Bildirimler</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Tüm bildirimleri yönet</div>
                        </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Yakında</div>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--color-accent)'
                        }}>
                            <Globe size={20} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 500 }}>Dil</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Türkçe (Varsayılan)</div>
                        </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Yakında</div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;

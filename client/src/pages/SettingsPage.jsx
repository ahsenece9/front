import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, 
    Lock, 
    Bell, 
    Palette, 
    Shield, 
    ArrowLeft,
    Save,
    Upload,
    Mail,
    Phone,
    Globe,
    Moon,
    Sun,
    Monitor,
    Eye,
    EyeOff,
    Trash2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Settings.css';

const SettingsPage = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');
    const [toast, setToast] = useState(null);

    // Profile settings
    const [profileSettings, setProfileSettings] = useState({
        fullName: '',
        username: '',
        email: '',
        phone: '',
        bio: '',
        avatarUrl: ''
    });

    // Account settings
    const [accountSettings, setAccountSettings] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        newEmail: ''
    });

    // Notification settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false,
        weeklyDigest: true,
        securityAlerts: true
    });

    // Appearance settings
    const [appearanceSettings, setAppearanceSettings] = useState({
        theme: theme || 'system',
        language: 'tr',
        fontSize: 16,
        accentColor: 'blue'
    });

    // Privacy settings
    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: true,
        showEmail: false,
        showActivity: true,
        dataCollection: true,
        searchEngineIndexing: true
    });

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        const loadSettings = () => {
            const savedProfile = localStorage.getItem('profileSettings');
            const savedNotifications = localStorage.getItem('notificationSettings');
            const savedAppearance = localStorage.getItem('appearanceSettings');
            const savedPrivacy = localStorage.getItem('privacySettings');

            if (savedProfile) setProfileSettings(JSON.parse(savedProfile));
            if (savedNotifications) setNotificationSettings(JSON.parse(savedNotifications));
            if (savedAppearance) setAppearanceSettings(JSON.parse(savedAppearance));
            if (savedPrivacy) setPrivacySettings(JSON.parse(savedPrivacy));
        };
        loadSettings();
    }, []);

    // Show toast
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Save handlers
    const saveProfileSettings = () => {
        localStorage.setItem('profileSettings', JSON.stringify(profileSettings));
        showToast('Profil ayarları kaydedildi!', 'success');
    };

    const saveAccountSettings = () => {
        if (accountSettings.newPassword && accountSettings.newPassword !== accountSettings.confirmPassword) {
            showToast('Şifreler eşleşmiyor!', 'error');
            return;
        }
        showToast('Hesap ayarları güncellendi!', 'success');
        setAccountSettings({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            newEmail: ''
        });
    };

    const saveNotificationSettings = () => {
        localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
        showToast('Bildirim tercihleri kaydedildi!', 'success');
    };

    const saveAppearanceSettings = () => {
        localStorage.setItem('appearanceSettings', JSON.stringify(appearanceSettings));
        if (appearanceSettings.theme !== theme) {
            if (appearanceSettings.theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else if (appearanceSettings.theme === 'light') {
                document.documentElement.setAttribute('data-theme', 'light');
            } else {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
            }
        }
        showToast('Görünüm ayarları kaydedildi!', 'success');
    };

    const savePrivacySettings = () => {
        localStorage.setItem('privacySettings', JSON.stringify(privacySettings));
        showToast('Gizlilik ayarları kaydedildi!', 'success');
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileSettings({ ...profileSettings, avatarUrl: reader.result });
                showToast('Avatar yüklendi!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    const deleteAccount = () => {
        showToast('Hesap silindi!', 'error');
        localStorage.clear();
        setTimeout(() => navigate('/'), 2000);
    };

    return (
        <div className="settings-container">
            {toast && (
                <div className={`settings-toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}

            <div className="settings-content">
                {/* Header */}
                <div className="settings-header">
                    <button
                        onClick={() => navigate(-1)}
                        className="settings-back-btn"
                    >
                        <ArrowLeft size={18} />
                        Geri Dön
                    </button>

                    <div className="settings-title-card">
                        <h1 className="settings-title">⚙️ Ayarlar</h1>
                        <p className="settings-subtitle">Hesap ve tercihlerinizi yönetin</p>
                    </div>
                </div>

                {/* Settings Tabs */}
                <div className="settings-tabs-wrapper">
                    <div className="settings-tabs-list">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
                        >
                            <User size={16} />
                            Profil
                        </button>
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
                        >
                            <Lock size={16} />
                            Hesap
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                        >
                            <Bell size={16} />
                            Bildirimler
                        </button>
                        <button
                            onClick={() => setActiveTab('appearance')}
                            className={`settings-tab ${activeTab === 'appearance' ? 'active' : ''}`}
                        >
                            <Palette size={16} />
                            Görünüm
                        </button>
                        <button
                            onClick={() => setActiveTab('privacy')}
                            className={`settings-tab ${activeTab === 'privacy' ? 'active' : ''}`}
                        >
                            <Shield size={16} />
                            Gizlilik
                        </button>
                    </div>

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="settings-tab-content">
                            <div className="settings-card">
                                <div className="settings-card-header profile-header">
                                    <div className="settings-card-title">
                                        <User size={24} />
                                        Profil Bilgileri
                                    </div>
                                    <p className="settings-card-desc">Genel profil bilgilerinizi güncelleyin</p>
                                </div>
                                <div className="settings-card-body">
                                    {/* Avatar */}
                                    <div className="settings-avatar-section">
                                        <div className="settings-avatar">
                                            {profileSettings.avatarUrl ? (
                                                <img src={profileSettings.avatarUrl} alt="Avatar" />
                                            ) : (
                                                <div className="settings-avatar-fallback">
                                                    {profileSettings.fullName?.charAt(0) || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="avatar-upload" className="settings-upload-btn">
                                                <Upload size={16} />
                                                Avatar Yükle
                                            </label>
                                            <input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarUpload}
                                            />
                                            <p className="settings-upload-hint">JPG, PNG veya GIF (Maks. 5MB)</p>
                                        </div>
                                    </div>

                                    <div className="settings-divider" />

                                    {/* Form Fields */}
                                    <div className="settings-form-grid">
                                        <div className="settings-form-group">
                                            <label>Ad Soyad</label>
                                            <input
                                                type="text"
                                                placeholder="Ad Soyad"
                                                value={profileSettings.fullName}
                                                onChange={(e) => setProfileSettings({ ...profileSettings, fullName: e.target.value })}
                                            />
                                        </div>
                                        <div className="settings-form-group">
                                            <label>Kullanıcı Adı</label>
                                            <input
                                                type="text"
                                                placeholder="@kullaniciadi"
                                                value={profileSettings.username}
                                                onChange={(e) => setProfileSettings({ ...profileSettings, username: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="settings-form-grid">
                                        <div className="settings-form-group">
                                            <label>
                                                <Mail size={16} />
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="email@ornek.com"
                                                value={profileSettings.email}
                                                onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="settings-form-group">
                                            <label>
                                                <Phone size={16} />
                                                Telefon
                                            </label>
                                            <input
                                                type="tel"
                                                placeholder="+90 555 123 4567"
                                                value={profileSettings.phone}
                                                onChange={(e) => setProfileSettings({ ...profileSettings, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="settings-form-group">
                                        <label>Biyografi</label>
                                        <textarea
                                            placeholder="Kendiniz hakkında kısa bir açıklama..."
                                            value={profileSettings.bio}
                                            onChange={(e) => setProfileSettings({ ...profileSettings, bio: e.target.value })}
                                            rows={4}
                                        />
            </div>

                                    <button onClick={saveProfileSettings} className="settings-save-btn profile-btn">
                                        <Save size={18} />
                                        Profil Ayarlarını Kaydet
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Account Tab */}
                    {activeTab === 'account' && (
                        <div className="settings-tab-content">
                            <div className="space-y-6">
                                <div className="settings-card">
                                    <div className="settings-card-header account-header">
                                        <div className="settings-card-title">
                                            <Lock size={24} />
                                            Şifre Değiştir
                                        </div>
                                        <p className="settings-card-desc">Hesap güvenliğiniz için şifrenizi güncelleyin</p>
                                    </div>
                                    <div className="settings-card-body">
                                        <div className="settings-form-group">
                                            <label>Mevcut Şifre</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                value={accountSettings.currentPassword}
                                                onChange={(e) => setAccountSettings({ ...accountSettings, currentPassword: e.target.value })}
                                            />
                                        </div>
                                        <div className="settings-form-group">
                                            <label>Yeni Şifre</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                value={accountSettings.newPassword}
                                                onChange={(e) => setAccountSettings({ ...accountSettings, newPassword: e.target.value })}
                                            />
                                        </div>
                                        <div className="settings-form-group">
                                            <label>Yeni Şifre (Tekrar)</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                value={accountSettings.confirmPassword}
                                                onChange={(e) => setAccountSettings({ ...accountSettings, confirmPassword: e.target.value })}
                                            />
                                        </div>
                                        <button onClick={saveAccountSettings} className="settings-save-btn account-btn">
                                            <Save size={18} />
                                            Şifreyi Güncelle
                                        </button>
                                    </div>
                                </div>

                                <div className="settings-card danger-card">
                                    <div className="settings-card-header danger-header">
                                        <div className="settings-card-title danger-title">
                                            <Trash2 size={24} />
                                            Tehlikeli Alan
                                        </div>
                                        <p className="settings-card-desc">Hesabınızı kalıcı olarak silin</p>
                                    </div>
                                    <div className="settings-card-body">
                                        <button onClick={() => setShowDeleteDialog(true)} className="settings-delete-btn">
                                            <Trash2 size={18} />
                                            Hesabı Sil
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="settings-tab-content">
                            <div className="settings-card">
                                <div className="settings-card-header notifications-header">
                                    <div className="settings-card-title">
                                        <Bell size={24} />
                                        Bildirim Tercihleri
                                    </div>
                                    <p className="settings-card-desc">Hangi bildirimleri almak istediğinizi seçin</p>
                                </div>
                                <div className="settings-card-body">
                                    <div className="settings-switch-list">
                                        <div className="settings-switch-item">
                                            <div>
                                                <label className="settings-switch-label">Email Bildirimleri</label>
                                                <p className="settings-switch-desc">Önemli güncellemeler için email alın</p>
                                            </div>
                                            <label className="settings-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.emailNotifications}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                                                />
                                                <span className="settings-switch-slider" />
                                            </label>
                                        </div>

                                        <div className="settings-switch-item">
                                            <div>
                                                <label className="settings-switch-label">Push Bildirimleri</label>
                                                <p className="settings-switch-desc">Anlık bildirimler alın</p>
                                            </div>
                                            <label className="settings-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.pushNotifications}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                                                />
                                                <span className="settings-switch-slider" />
                                            </label>
                                        </div>

                                        <div className="settings-switch-item">
                                            <div>
                                                <label className="settings-switch-label">Güvenlik Uyarıları</label>
                                                <p className="settings-switch-desc">Hesap güvenliği hakkında bildirimler</p>
                                            </div>
                                            <label className="settings-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.securityAlerts}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, securityAlerts: e.target.checked })}
                                                />
                                                <span className="settings-switch-slider" />
                                            </label>
                                        </div>

                                        <div className="settings-divider" />

                                        <div className="settings-switch-item">
                                            <div>
                                                <label className="settings-switch-label">Pazarlama Emailleri</label>
                                                <p className="settings-switch-desc">Özel teklifler ve haberler</p>
                                            </div>
                                            <label className="settings-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.marketingEmails}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, marketingEmails: e.target.checked })}
                                                />
                                                <span className="settings-switch-slider" />
                                            </label>
                                        </div>

                                        <div className="settings-switch-item">
                                            <div>
                                                <label className="settings-switch-label">Haftalık Özet</label>
                                                <p className="settings-switch-desc">Haftalık aktivite özeti alın</p>
                                            </div>
                                            <label className="settings-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.weeklyDigest}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyDigest: e.target.checked })}
                                                />
                                                <span className="settings-switch-slider" />
                                            </label>
                        </div>
                    </div>

                                    <button onClick={saveNotificationSettings} className="settings-save-btn notifications-btn">
                                        <Save size={18} />
                                        Bildirim Tercihlerini Kaydet
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === 'appearance' && (
                        <div className="settings-tab-content">
                            <div className="settings-card">
                                <div className="settings-card-header appearance-header">
                                    <div className="settings-card-title">
                                        <Palette size={24} />
                                        Görünüm Ayarları
                                    </div>
                                    <p className="settings-card-desc">Uygulamanın görünümünü özelleştirin</p>
                                </div>
                                <div className="settings-card-body">
                                    {/* Theme Selector */}
                                    <div className="settings-form-group">
                                        <label className="settings-section-label">Tema</label>
                                        <div className="settings-theme-grid">
                                            <button
                                                onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'light' })}
                                                className={`settings-theme-btn ${appearanceSettings.theme === 'light' ? 'active' : ''}`}
                                            >
                                                <Sun size={24} />
                                                <p>Açık</p>
                                            </button>
                                            <button
                                                onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'dark' })}
                                                className={`settings-theme-btn ${appearanceSettings.theme === 'dark' ? 'active' : ''}`}
                                            >
                                                <Moon size={24} />
                                                <p>Koyu</p>
                                            </button>
                    <button
                                                onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'system' })}
                                                className={`settings-theme-btn ${appearanceSettings.theme === 'system' ? 'active' : ''}`}
                                            >
                                                <Monitor size={24} />
                                                <p>Sistem</p>
                    </button>
                </div>
            </div>

                                    <div className="settings-divider" />

                                    {/* Language Selector */}
                                    <div className="settings-form-group">
                                        <label className="settings-section-label">
                                            <Globe size={16} />
                                            Dil
                                        </label>
                                        <select
                                            value={appearanceSettings.language}
                                            onChange={(e) => setAppearanceSettings({ ...appearanceSettings, language: e.target.value })}
                                            className="settings-select"
                                        >
                                            <option value="tr">🇹🇷 Türkçe</option>
                                            <option value="en">🇬🇧 English</option>
                                            <option value="de">🇩🇪 Deutsch</option>
                                            <option value="fr">🇫🇷 Français</option>
                                            <option value="es">🇪🇸 Español</option>
                                        </select>
                                    </div>

                                    {/* Font Size Slider */}
                                    <div className="settings-form-group">
                                        <div className="settings-slider-header">
                                            <label className="settings-section-label">Yazı Boyutu</label>
                                            <span className="settings-slider-value">{appearanceSettings.fontSize}px</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="12"
                                            max="24"
                                            value={appearanceSettings.fontSize}
                                            onChange={(e) => setAppearanceSettings({ ...appearanceSettings, fontSize: parseInt(e.target.value) })}
                                            className="settings-slider"
                                        />
                                        <div className="settings-slider-labels">
                                            <span>Küçük</span>
                                            <span>Orta</span>
                                            <span>Büyük</span>
                                        </div>
                                    </div>

                                    {/* Accent Color */}
                                    <div className="settings-form-group">
                                        <label className="settings-section-label">Vurgu Rengi</label>
                                        <div className="settings-color-grid">
                                            {[
                                                { name: 'blue', color: '#3b82f6' },
                                                { name: 'purple', color: '#a855f7' },
                                                { name: 'pink', color: '#ec4899' },
                                                { name: 'green', color: '#10b981' },
                                                { name: 'orange', color: '#f59e0b' },
                                                { name: 'red', color: '#ef4444' }
                                            ].map((color) => (
                                                <button
                                                    key={color.name}
                                                    onClick={() => setAppearanceSettings({ ...appearanceSettings, accentColor: color.name })}
                                                    className={`settings-color-btn ${appearanceSettings.accentColor === color.name ? 'active' : ''}`}
                                                    style={{ backgroundColor: color.color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <button onClick={saveAppearanceSettings} className="settings-save-btn appearance-btn">
                                        <Save size={18} />
                                        Görünüm Ayarlarını Kaydet
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === 'privacy' && (
                        <div className="settings-tab-content">
                            <div className="settings-card">
                                <div className="settings-card-header privacy-header">
                                    <div className="settings-card-title">
                                        <Shield size={24} />
                                        Gizlilik Ayarları
                                    </div>
                                    <p className="settings-card-desc">Gizlilik ve veri tercihlerinizi yönetin</p>
                                </div>
                                <div className="settings-card-body">
                                    <div className="settings-switch-list">
                                        <div className="settings-switch-item">
                                            <div className="settings-switch-content">
                                                <Eye size={20} />
                                                <div>
                                                    <label className="settings-switch-label">Profil Görünürlüğü</label>
                                                    <p className="settings-switch-desc">Profiliniz herkese açık olsun</p>
                                                </div>
                                            </div>
                                            <label className="settings-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={privacySettings.profileVisibility}
                                                    onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.checked })}
                                                />
                                                <span className="settings-switch-slider" />
                                            </label>
                                        </div>

                                        <div className="settings-switch-item">
                                            <div className="settings-switch-content">
                                                <Mail size={20} />
                                                <div>
                                                    <label className="settings-switch-label">Email Göster</label>
                                                    <p className="settings-switch-desc">Email adresiniz profilinizde görünsün</p>
                                                </div>
                                            </div>
                                            <label className="settings-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={privacySettings.showEmail}
                                                    onChange={(e) => setPrivacySettings({ ...privacySettings, showEmail: e.target.checked })}
                                                />
                                                <span className="settings-switch-slider" />
                                            </label>
                                        </div>

                                        <div className="settings-switch-item">
                                            <div className="settings-switch-content">
                                                <Eye size={20} />
                                                <div>
                                                    <label className="settings-switch-label">Aktivite Göster</label>
                                                    <p className="settings-switch-desc">Aktiviteleriniz görülebilsin</p>
                                                </div>
                                            </div>
                                            <label className="settings-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={privacySettings.showActivity}
                                                    onChange={(e) => setPrivacySettings({ ...privacySettings, showActivity: e.target.checked })}
                                                />
                                                <span className="settings-switch-slider" />
                                            </label>
                                        </div>

                                        <div className="settings-divider" />

                                        <div className="settings-switch-item">
                                            <div className="settings-switch-content">
                                                <Shield size={20} />
                        <div>
                                                    <label className="settings-switch-label">Veri Toplama</label>
                                                    <p className="settings-switch-desc">Kullanım verilerinin toplanmasına izin ver</p>
                        </div>
                    </div>
                                            <label className="settings-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={privacySettings.dataCollection}
                                                    onChange={(e) => setPrivacySettings({ ...privacySettings, dataCollection: e.target.checked })}
                                                />
                                                <span className="settings-switch-slider" />
                                            </label>
                </div>

                                        <div className="settings-switch-item">
                                            <div className="settings-switch-content">
                            <Globe size={20} />
                                                <div>
                                                    <label className="settings-switch-label">Arama Motoru İndeksleme</label>
                                                    <p className="settings-switch-desc">Profiliniz arama motorlarında görünsün</p>
                                                </div>
                                            </div>
                                            <label className="settings-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={privacySettings.searchEngineIndexing}
                                                    onChange={(e) => setPrivacySettings({ ...privacySettings, searchEngineIndexing: e.target.checked })}
                                                />
                                                <span className="settings-switch-slider" />
                                            </label>
                                        </div>
                                    </div>

                                    <button onClick={savePrivacySettings} className="settings-save-btn privacy-btn">
                                        <Save size={18} />
                                        Gizlilik Ayarlarını Kaydet
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Account Dialog */}
            {showDeleteDialog && (
                <div className="settings-dialog-overlay" onClick={() => setShowDeleteDialog(false)}>
                    <div className="settings-dialog" onClick={(e) => e.stopPropagation()}>
                        <h3 className="settings-dialog-title">Emin misiniz?</h3>
                        <p className="settings-dialog-desc">
                            Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecektir.
                        </p>
                        <div className="settings-dialog-actions">
                            <button onClick={() => setShowDeleteDialog(false)} className="settings-dialog-cancel">
                                İptal
                            </button>
                            <button onClick={deleteAccount} className="settings-dialog-confirm">
                                Evet, Hesabı Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;

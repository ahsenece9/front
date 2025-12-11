import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    Calendar,
    Clock,
    Plus,
    Play,
    ArrowRight,
    Target,
    Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ Eklendi

// 🎯 Motivasyon sözleri havuzu
const motivationalQuotes = [
    {
        text: "Başarı, her gün tekrarlanan küçük çabaların toplamıdır.",
        author: "Robert Collier"
    },
    {
        text: "Yarının yapabileceklerini bugüne bırakma, çünkü yarın hiç gelmeyebilir.",
        author: "Bruce Lee"
    },
    {
        text: "Başarısızlık başarının anahtarıdır; her hata bize bir şey öğretir.",
        author: "Morihei Ueshiba"
    },
    {
        text: "Yapabileceğine inandığın ya da inanamadığın - her iki durumda da haklısın.",
        author: "Henry Ford"
    },
    {
        text: "Hayal kurmayan, hayallerini gerçekleştiremez.",
        author: "Mustafa Kemal Atatürk"
    },
    {
        text: "Hayatta en hakiki mürşit ilimdir.",
        author: "Mustafa Kemal Atatürk"
    },
    {
        text: "Başarı son değil, başarısızlık ölümcül değil: Devam etme cesareti önemli olandır.",
        author: "Winston Churchill"
    },
    {
        text: "Eğitim geleceğin açılacağı pasaporttur, yarın kendini bugün hazırlayanlarındır.",
        author: "Malcolm X"
    },
    {
        text: "Bir insanın başarısının sırrı, amacını bulması ve tüm enerjisini ona vermesidir.",
        author: "Benjamin Franklin"
    },
    {
        text: "Hedeflerinize ulaşmanın en iyi yolu, onları gerçekleştirmek için harekete geçmektir.",
        author: "Pablo Picasso"
    }
];

const DashboardHome = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // ✅ Kullanıcı bilgisini al

    // 🎲 Her gün rastgele farklı bir söz seçmek için
    const [dailyQuote, setDailyQuote] = useState(motivationalQuotes[0]);

    useEffect(() => {
        // Bugünün tarihini kullanarak seed oluştur (her gün aynı söz)
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const quoteIndex = dayOfYear % motivationalQuotes.length;
        setDailyQuote(motivationalQuotes[quoteIndex]);
    }, []);

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

    const stats = [
        {
            title: 'Bekleyen Görevler',
            value: '12',
            label: 'Tamamlanacak',
            icon: <CheckCircle size={24} />,
            color: 'var(--color-warning)',
            bg: 'rgba(245, 158, 11, 0.1)',
            link: '/dashboard/todo'
        },
        {
            title: 'Bugünkü Plan',
            value: '3',
            label: 'Etkinlik',
            icon: <Calendar size={24} />,
            color: 'var(--color-primary)',
            bg: 'rgba(99, 102, 241, 0.1)',
            link: '/dashboard/calendar'
        },
        {
            title: 'Odaklanma Süresi',
            value: '45dk',
            label: 'Bugün',
            icon: <Clock size={24} />,
            color: 'var(--color-success)',
            bg: 'rgba(16, 185, 129, 0.1)',
            link: '/dashboard/pomodoro'
        },
        {
            title: 'Verimlilik',
            value: '%85',
            label: 'Artış',
            icon: <Zap size={24} />,
            color: 'var(--color-accent)',
            bg: 'rgba(139, 92, 246, 0.1)',
            link: '/dashboard/todo'
        }
    ];

    const quickActions = [
        { title: 'Yeni Görev', icon: <Plus size={20} />, action: () => navigate('/dashboard/todo') },
        { title: 'Pomodoro Başlat', icon: <Play size={20} />, action: () => navigate('/dashboard/pomodoro') },
        { title: 'Takvimi Aç', icon: <Calendar size={20} />, action: () => navigate('/dashboard/calendar') },
    ];

    // ✅ Kullanıcı adını al - full_name veya email'den önce
    const displayName = user?.full_name || user?.name || user?.email?.split('@')[0] || 'Kullanıcı';

    return (
        <motion.div
            className="dashboard-home"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Welcome Section */}
            <motion.div className="welcome-section" variants={itemVariants}>
                <div className="welcome-text">
                    <h1>Hoşgeldin, {displayName}! 👋</h1>
                    <p>Bugün harika işler başarmaya hazır mısın?</p>
                </div>
                <div className="date-display">
                    {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div className="stats-grid" variants={itemVariants}>
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        className="stat-card"
                        whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
                        onClick={() => navigate(stat.link)}
                    >
                        <div className="stat-icon" style={{ color: stat.color, background: stat.bg }}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
                            <div className="stat-title">{stat.title}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="dashboard-content-row">
                {/* Quick Actions */}
                <motion.div className="dashboard-card quick-actions" variants={itemVariants}>
                    <h3>Hızlı İşlemler</h3>
                    <div className="actions-list">
                        {quickActions.map((action, index) => (
                            <motion.button
                                key={index}
                                className="action-button"
                                whileHover={{ scale: 1.02, backgroundColor: 'var(--bg-hover)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={action.action}
                            >
                                <div className="action-icon">{action.icon}</div>
                                <span>{action.title}</span>
                                <ArrowRight size={16} className="arrow-icon" />
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Daily Focus/Quote */}
                <motion.div className="dashboard-card daily-focus" variants={itemVariants}>
                    <div className="focus-header">
                        <Target size={24} color="var(--color-primary)" />
                        <h3>Günün Sözü</h3>
                    </div>
                    <blockquote className="quote-text">
                        "{dailyQuote.text}"
                    </blockquote>
                    <div className="quote-author">- {dailyQuote.author}</div>

                    <div className="focus-tip">
                        <strong>İpucu:</strong> En zor görevini günün ilk saatlerinde tamamlamayı dene.
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default DashboardHome;
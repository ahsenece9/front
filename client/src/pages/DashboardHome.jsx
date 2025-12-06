import React from 'react';
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

const DashboardHome = () => {
    const navigate = useNavigate();

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
                    <h1>Hoşgeldin, Ahmet! 👋</h1>
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
                        "Başarı, her gün tekrarlanan küçük çabaların toplamıdır."
                    </blockquote>
                    <div className="quote-author">- Robert Collier</div>

                    <div className="focus-tip">
                        <strong>İpucu:</strong> En zor görevini günün ilk saatlerinde tamamlamayı dene.
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default DashboardHome;

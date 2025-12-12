import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Users,
    Activity,
    DollarSign,
    Target,
    Calendar,
    Clock,
    CheckCircle,
    ArrowUp,
    ArrowDown,
    BarChart3,
    PieChart,
    Zap,
    Award,
    MessageCircle,
    FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardHome = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const displayName = user?.full_name || user?.name || user?.email?.split('@')[0] || 'Kullanıcı';

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    // Mock data
    const todayStats = {
        completed: 24,
        growth: 12.5,
        focus: 145,
        productivity: 87
    };

    const statCards = [
        {
            title: 'Aktif Görevler',
            value: '42',
            change: '+12.5%',
            trend: 'up',
            icon: CheckCircle,
            color: '#3b82f6',
            bgColor: 'rgba(59, 130, 246, 0.1)'
        },
        {
            title: 'Tamamlanan',
            value: '156',
            change: '+8.2%',
            trend: 'up',
            icon: Award,
            color: '#10b981',
            bgColor: 'rgba(16, 185, 129, 0.1)'
        },
        {
            title: 'Odaklanma',
            value: '12.4s',
            change: '+23.1%',
            trend: 'up',
            icon: Target,
            color: '#8b5cf6',
            bgColor: 'rgba(139, 92, 246, 0.1)'
        },
        {
            title: 'Verimlilik',
            value: '%87',
            change: '-2.4%',
            trend: 'down',
            icon: TrendingUp,
            color: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.1)'
        }
    ];

    // Bar chart data
    const barData = [40, 65, 45, 80, 50, 70, 60, 85, 55, 75, 50, 70];
    const maxBar = Math.max(...barData);

    return (
        <motion.div
            className="dashboard-home"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ padding: '0' }}
        >
            {/* Welcome Banner */}
            <motion.div
                variants={itemVariants}
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    marginBottom: '2rem',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            fontWeight: 700,
                            color: '#667eea'
                        }}>
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>Hoşgeldin,</div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{displayName}!</h1>
                            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
                                {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{todayStats.completed}</div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Bugün Tamamlanan</div>
                            <div style={{
                                width: '60px',
                                height: '4px',
                                background: 'rgba(255,255,255,0.3)',
                                borderRadius: '2px',
                                marginTop: '0.5rem'
                            }}>
                                <div style={{ width: '70%', height: '100%', background: '#22c55e', borderRadius: '2px' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 700' }}>{todayStats.growth}%</div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Büyüme Oranı</div>
                            <div style={{
                                width: '60px',
                                height: '4px',
                                background: 'rgba(255,255,255,0.3)',
                                borderRadius: '2px',
                                marginTop: '0.5rem'
                            }}>
                                <div style={{ width: '80%', height: '100%', background: '#f59e0b', borderRadius: '2px' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative illustration placeholder */}
                <div style={{
                    position: 'absolute',
                    right: '2rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    opacity: 0.15,
                    fontSize: '10rem'
                }}>
                    💼
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                variants={itemVariants}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}
            >
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -5, boxShadow: 'var(--shadow-xl)' }}
                        style={{
                            background: 'var(--bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.5rem',
                            border: '1px solid var(--border-color)',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--radius-md)',
                                background: stat.bgColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <stat.icon size={24} color={stat.color} />
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: stat.trend === 'up' ? '#10b981' : '#ef4444'
                            }}>
                                {stat.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                                {stat.change}
                            </div>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                            {stat.value}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            {stat.title}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Monthly Activity - Bar Chart */}
                <motion.div
                    variants={itemVariants}
                    style={{
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.5rem',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Aylık Aktivite</h3>
                        <BarChart3 size={20} color="var(--text-muted)" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '150px' }}>
                        {barData.map((value, index) => (
                            <div
                                key={index}
                                style={{
                                    flex: 1,
                                    height: `${(value / maxBar) * 100}%`,
                                    background: `linear-gradient(180deg, ${index % 3 === 0 ? '#667eea' : index % 3 === 1 ? '#764ba2' : '#f093fb'} 0%, ${index % 3 === 0 ? '#764ba2' : index % 3 === 1 ? '#667eea' : '#4facfe'} 100%)`,
                                    borderRadius: '4px 4px 0 0',
                                    transition: 'all 0.3s'
                                }}
                            />
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>Oca</span>
                        <span>Şub</span>
                        <span>Mar</span>
                        <span>Nis</span>
                        <span>May</span>
                        <span>Haz</span>
                        <span>Tem</span>
                        <span>Ağu</span>
                        <span>Eyl</span>
                        <span>Eki</span>
                        <span>Kas</span>
                        <span>Ara</span>
                    </div>
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>68.9%</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ortalama verimlilik artışı</div>
                    </div>
                </motion.div>

                {/* Device Type - Donut Chart */}
                <motion.div
                    variants={itemVariants}
                    style={{
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.5rem',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Görev Dağılımı</h3>
                        <PieChart size={20} color="var(--text-muted)" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="88 251" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="20" strokeDasharray="63 251" strokeDashoffset="-88" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" strokeDasharray="100 251" strokeDashoffset="-151" />
                            </svg>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>68%</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tamamlanan</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#3b82f6' }} />
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>Yüksek Öncelik</span>
                            </div>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>35%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#f59e0b' }} />
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>Orta Öncelik</span>
                            </div>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>40%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#10b981' }} />
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>Düşük Öncelik</span>
                            </div>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>25%</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Recent Activity */}
                <motion.div
                    variants={itemVariants}
                    style={{
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.5rem',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Son Aktiviteler</h3>
                        <Activity size={20} color="var(--text-muted)" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { icon: CheckCircle, color: '#10b981', text: 'Proje raporu tamamlandı', time: '2 saat önce' },
                            { icon: MessageCircle, color: '#3b82f6', text: 'Yeni mesaj aldınız', time: '5 saat önce' },
                            { icon: FileText, color: '#f59e0b', text: 'Döküman güncellendi', time: '1 gün önce' },
                            { icon: Users, color: '#8b5cf6', text: 'Takım toplantısı', time: '2 gün önce' }
                        ].map((activity, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: `${activity.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <activity.icon size={18} color={activity.color} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '2px' }}>
                                        {activity.text}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {activity.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    variants={itemVariants}
                    style={{
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.5rem',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Haftalık Özet</h3>
                        <Zap size={20} color="var(--text-muted)" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Tamamlanan Görevler</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>45/50</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: '90%', height: '100%', background: 'linear-gradient(90deg, #10b981, #14b8a6)', borderRadius: '4px' }} />
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Odaklanma Süresi</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>12.4/15s</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: '82%', height: '100%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: '4px' }} />
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Hedef Başarısı</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>7/10</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: '70%', height: '100%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)', borderRadius: '4px' }} />
                            </div>
                        </div>
                    </div>
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                            %87
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Genel Verimlilik
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default DashboardHome;

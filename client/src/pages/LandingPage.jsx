import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail, Phone, MapPin } from 'lucide-react';
import '../styles/LandingPage.css';

const LandingPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const features = [
        {
            id: 'pomodoro',
            title: 'Pomodoro Tekniği',
            description: 'Odaklanma sürenizi maksimuma çıkarın. Özelleştirilebilir zamanlayıcılar, rahatlatıcı sesler ve konsantrasyon modu ile verimliliğinizi artırın.',
            color: '#ec4899',
            visual: (
                <div className="pomodoro-mockup">
                    25:00
                </div>
            )
        },
        {
            id: 'calendar',
            title: 'Akıllı Takvim',
            description: 'Tüm planlarınız tek bir yerde. Emojilerle gününüzü renklendirin, detaylı notlar alın ve hiçbir etkinliği kaçırmayın.',
            color: '#8b5cf6',
            visual: (
                <div className="calendar-mockup">
                    {[...Array(28)].map((_, i) => (
                        <div key={i} className={`cal-day ${i === 15 ? 'active' : ''}`}></div>
                    ))}
                </div>
            )
        }
    ];

    // Auto-slide carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % features.length);
        }, 5000); // Her 5 saniyede bir değişir

        return () => clearInterval(interval);
    }, [features.length]);

    return (
        <div className="landing-container">
            {/* Navbar with auth buttons on the top-left */}
            <nav className="navbar">
                <div className="navbar-left">
                    <div className="logo">UniPlan</div>
                    <div className="nav-links">
                        <Link
                            className="btn btn-small btn-ghost"
                            to="/login"
                        >
                            Giriş Yap
                        </Link>
                        <Link
                            className="btn btn-small btn-primary"
                            to="/register"
                        >
                            Kayıt Ol
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <motion.h1
                    className="hero-title"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Planlamanın <br /> Yeni Boyutu
                </motion.h1>
                <motion.p
                    className="hero-subtitle"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Hayatınızı organize edin, hedeflerinize ulaşın. UniPlan ile zamanı yönetmek hiç olmadığı kadar keyifli.
                </motion.p>
                <motion.div
                    className="scroll-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7, y: [0, 10, 0] }}
                    transition={{ delay: 1, duration: 2, repeat: Infinity }}
                >
                    <ChevronDown size={32} />
                </motion.div>
            </section>

            {/* Features Carousel Section */}
            <section className="features-carousel-section">
                <div className="carousel-container">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            className="carousel-slide"
                            initial={{ opacity: 0, x: 300 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -300 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            <div className="feature-slide-content">
                                <div className="feature-visual-wrapper">
                                    {features[currentSlide].visual}
                                </div>
                                <div className="feature-text-wrapper">
                                    <h2 
                                        className="feature-title"
                                        style={{ color: features[currentSlide].color }}
                                    >
                                        {features[currentSlide].title}
                                    </h2>
                                    <p className="feature-desc">
                                        {features[currentSlide].description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    
                    {/* Carousel Indicators */}
                    <div className="carousel-indicators">
                        {features.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                                aria-label={`Slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <h2 className="contact-title">İletişim</h2>
                <div className="contact-info">
                    <div className="contact-item">
                        <Mail size={20} />
                        <span>info@uniplan.com</span>
                    </div>
                    <div className="contact-item">
                        <Phone size={20} />
                        <span>+90 555 123 45 67</span>
                    </div>
                    <div className="contact-item">
                        <MapPin size={20} />
                        <span>İstanbul, Türkiye</span>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CalendarModal from '../components/CalendarModal';
import '../styles/Calendar.css';

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState({}); // { "YYYY-MM-DD": { title, description, emoji } }

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sunday

    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const monthNames = [
        "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDayClick = (day) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDate(dateStr);
        setIsModalOpen(true);
    };

    const handleSaveEvent = (date, data) => {
        setEvents(prev => ({
            ...prev,
            [date]: data
        }));
    };

    const renderDays = () => {
        const days = [];

        // Empty cells for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty" style={{ opacity: 0.3 }}></div>);
        }

        // Days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
            const event = events[dateStr];

            days.push(
                <motion.div
                    key={day}
                    className={`calendar-day ${isToday ? 'today' : ''}`}
                    onClick={() => handleDayClick(day)}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: day * 0.01 }}
                >
                    <div className="day-number">{day}</div>
                    {event && event.emoji && <div className="day-emoji">{event.emoji}</div>}
                    <div className="day-content">
                        {event && event.title && <div className="day-event">{event.title}</div>}
                    </div>
                </motion.div>
            );
        }

        return days;
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <h1 className="calendar-title">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h1>
                <div className="calendar-nav">
                    <button className="btn btn-ghost" onClick={handlePrevMonth}>
                        <ChevronLeft size={24} />
                    </button>
                    <button className="btn btn-ghost" onClick={handleNextMonth}>
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div className="calendar-grid">
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                    <div key={day} className="weekday-header">{day}</div>
                ))}
                {renderDays()}
            </div>

            <CalendarModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                date={selectedDate}
                initialData={selectedDate ? events[selectedDate] : null}
                onSave={handleSaveEvent}
            />
        </div>
    );
};

export default CalendarPage;

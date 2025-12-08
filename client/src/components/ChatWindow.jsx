import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, MoreVertical, Phone, Video, Sparkles } from 'lucide-react';

const ChatWindow = ({ friend, messages, onSendMessage, messagesEndRef }) => {
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, messagesEndRef]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        onSendMessage(newMessage);
        setNewMessage('');
    };

    if (!friend) {
        return (
            <div className="min-h-[60vh] grid place-items-center bg-gradient-to-br from-slate-900/60 via-indigo-900/60 to-purple-900/50 text-slate-200">
                <div className="text-center space-y-3">
                    <div className="text-5xl">💬</div>
                    <p className="text-lg font-semibold">Bir sohbet seçin veya yeni bir kişi ekleyin.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-white/30 dark:border-slate-800 bg-gradient-to-r from-indigo-700/90 via-purple-700/80 to-fuchsia-600/80 text-white flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-2xl bg-white/20 grid place-items-center font-bold">
                    {friend.avatar}
                    <span
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            friend.online ? 'bg-emerald-300' : 'bg-slate-400'
                        }`}
                    />
                </div>
                <div className="flex-1">
                    <p className="text-lg font-bold">{friend.name}</p>
                    <p className="text-sm text-white/80">{friend.online ? 'Çevrimiçi' : 'Çevrimdışı'}</p>
                    </div>
                <div className="flex items-center gap-2 text-white/90">
                    <button className="p-2 rounded-xl hover:bg-white/15 transition"><Phone size={18} /></button>
                    <button className="p-2 rounded-xl hover:bg-white/15 transition"><Video size={18} /></button>
                    <button className="p-2 rounded-xl hover:bg-white/15 transition"><MoreVertical size={18} /></button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gradient-to-br from-white/70 via-white/60 to-purple-50 dark:from-slate-900/60 dark:via-slate-900/50 dark:to-slate-800/40">
                {messages.length === 0 && (
                    <div className="flex h-full items-center justify-center text-slate-500 dark:text-slate-400">
                        Henüz mesaj yok. İlk mesajı gönder!
                    </div>
                )}

                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-lg ${
                                msg.sender === 'me'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                                    : 'bg-white/90 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 border border-white/50 dark:border-slate-800 rounded-bl-none'
                            }`}
                        >
                            <p className="leading-relaxed">{msg.text}</p>
                            <div className={`text-[11px] mt-2 flex items-center gap-1 ${msg.sender === 'me' ? 'text-white/70' : 'text-slate-500'}`}>
                                <Sparkles size={12} /> {msg.time}
                            </div>
                    </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/30 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70">
                <form onSubmit={handleSend} className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-inner">
                    <input
                        type="text"
                        className="flex-1 bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                        placeholder="Bir mesaj yaz..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
                        disabled={!newMessage.trim()}
                    >
                        <Send size={16} />
                        Gönder
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;

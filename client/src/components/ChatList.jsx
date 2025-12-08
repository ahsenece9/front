import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Wifi } from 'lucide-react';

const ChatList = ({ friends, filteredFriends, selectedFriendId, onSelectFriend, filter, onSetFilter, onOpenSearch }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-200">
                    <Wifi size={16} className="text-emerald-400" />
                    {filter === 'online' ? 'Çevrimiçi' : 'Tüm arkadaşlar'}
                </div>
                <button
                    onClick={onOpenSearch}
                    className="inline-flex items-center gap-1 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full text-sm font-semibold transition"
                >
                    <UserPlus size={16} /> Ekle
                </button>
                    </div>

            <div className="flex gap-2 px-1">
                {['all', 'online'].map((value) => (
                    <button
                        key={value}
                        onClick={() => onSetFilter(value)}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
                            filter === value
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-400/30'
                                : 'bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 border border-white/40 dark:border-slate-700'
                        }`}
                    >
                        {value === 'all' ? 'Tümü' : 'Çevrimiçi'}
                    </button>
                ))}
            </div>

            <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
                {filteredFriends.map((friend, idx) => (
                    <motion.button
                        layout
                        key={friend.id}
                        onClick={() => onSelectFriend(friend)}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl transition text-left ${
                            selectedFriendId === friend.id
                                ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/80 text-white shadow-lg'
                                : 'bg-white/80 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 border border-white/40 dark:border-slate-800 hover:-translate-y-[2px] shadow-sm'
                        }`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.03 } }}
                        whileHover={{ scale: 1.01 }}
                    >
                        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-amber-400 text-white font-bold grid place-items-center">
                            {friend.avatar}
                            <span
                                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                    friend.online ? 'bg-emerald-400' : 'bg-slate-400'
                                }`}
                            />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-base">{friend.name}</p>
                            <p className={`text-sm line-clamp-1 ${selectedFriendId === friend.id ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
                                {friend.lastMessage || '@' + friend.username}
                            </p>
                        </div>
                        {friend.online && <div className="text-xs font-semibold text-emerald-200">online</div>}
                    </motion.button>
                ))}

                {filteredFriends.length === 0 && (
                    <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-6 border border-dashed border-white/40 rounded-2xl">
                        Bu filtrede kişi yok
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;

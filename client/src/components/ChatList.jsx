import React from 'react';
import { UserPlus } from 'lucide-react';
import '../styles/Chat.css';

const ChatList = ({ friends, selectedFriendId, onSelectFriend, filter, onSetFilter, onOpenSearch }) => {
    const filteredFriends = filter === 'online'
        ? friends.filter(f => f.online)
        : friends;

    return (
        <div className="chat-sidebar">
            <div className="chat-sidebar-header">
                <div className="chat-title">
                    <span>Sohbetler</span>
                    <div
                        className="icon-btn"
                        style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)' }}
                        onClick={onOpenSearch}
                    >
                        <UserPlus size={18} />
                    </div>
                </div>

                <div className="chat-filter">
                    <div
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => onSetFilter('all')}
                    >
                        Tümü
                    </div>
                    <div
                        className={`filter-btn ${filter === 'online' ? 'active' : ''}`}
                        onClick={() => onSetFilter('online')}
                    >
                        Çevrimiçi
                    </div>
                </div>
            </div>

            <div className="friend-list">
                {filteredFriends.map(friend => (
                    <div
                        key={friend.id}
                        className={`friend-item ${selectedFriendId === friend.id ? 'active' : ''}`}
                        onClick={() => onSelectFriend(friend)}
                    >
                        <div className="friend-avatar">
                            {friend.avatar}
                            <div className={`status-indicator ${friend.online ? 'status-online' : 'status-offline'}`}></div>
                        </div>
                        <div className="friend-info">
                            <div className="friend-name">{friend.name}</div>
                            <div className="friend-last-msg">{friend.lastMessage}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatList;

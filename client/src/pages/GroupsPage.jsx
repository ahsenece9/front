import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, LogIn } from 'lucide-react';
import '../styles/Groups.css';
import '../styles/Calendar.css'; // Reusing modal styles

const GroupsPage = () => {
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);

    // Mock Groups
    const [groups, setGroups] = useState([
        { id: 1, name: 'Proje Ekibi', members: 3, role: 'Yönetici' },
        { id: 2, name: 'Haftasonu Gezisi', members: 5, role: 'Üye' },
    ]);

    // Form States
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupPassword, setNewGroupPassword] = useState('');
    const [joinGroupName, setJoinGroupName] = useState('');
    const [joinGroupPassword, setJoinGroupPassword] = useState('');

    const handleCreateGroup = () => {
        if (!newGroupName || !newGroupPassword) return;
        const newGroup = {
            id: Date.now(),
            name: newGroupName,
            members: 1,
            role: 'Yönetici'
        };
        setGroups([...groups, newGroup]);
        setShowCreateModal(false);
        setNewGroupName('');
        setNewGroupPassword('');
    };

    const handleJoinGroup = () => {
        // Mock join logic
        if (!joinGroupName || !joinGroupPassword) return;
        alert(`"${joinGroupName}" grubuna katılma isteği gönderildi (veya şifre doğruysa katıldı).`);
        setShowJoinModal(false);
        setJoinGroupName('');
        setJoinGroupPassword('');
    };

    return (
        <div className="groups-container">
            <div className="groups-header">
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Gruplarım</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={() => setShowJoinModal(true)}>
                        <LogIn size={20} style={{ marginRight: '8px' }} /> Gruba Katıl
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                        <Plus size={20} style={{ marginRight: '8px' }} /> Grup Oluştur
                    </button>
                </div>
            </div>

            <div className="groups-grid">
                {groups.map(group => (
                    <div key={group.id} className="group-card" onClick={() => navigate(`/dashboard/groups/${group.id}`)}>
                        <div className="group-card-header">
                            <div className="group-icon">
                                {group.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="group-info">
                                <h3>{group.name}</h3>
                                <p>{group.members} Üye • {group.role}</p>
                            </div>
                        </div>
                        <div className="group-members-preview">
                            <div className="member-avatar-sm">AH</div>
                            <div className="member-avatar-sm">AL</div>
                            <div className="member-avatar-sm">ZE</div>
                            {group.members > 3 && <div style={{ marginLeft: '10px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>+{group.members - 3}</div>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Group Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="calendar-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-date">Yeni Grup Oluştur</div>
                        </div>
                        <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="text"
                                className="modal-input"
                                placeholder="Grup Adı"
                                value={newGroupName}
                                onChange={e => setNewGroupName(e.target.value)}
                            />
                            <input
                                type="password"
                                className="modal-input"
                                placeholder="Grup Şifresi"
                                value={newGroupPassword}
                                onChange={e => setNewGroupPassword(e.target.value)}
                            />
                            <button className="btn btn-primary" onClick={handleCreateGroup}>Oluştur</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Join Group Modal */}
            {showJoinModal && (
                <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
                    <div className="calendar-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-date">Gruba Katıl</div>
                        </div>
                        <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="text"
                                className="modal-input"
                                placeholder="Grup Adı"
                                value={joinGroupName}
                                onChange={e => setJoinGroupName(e.target.value)}
                            />
                            <input
                                type="password"
                                className="modal-input"
                                placeholder="Grup Şifresi"
                                value={joinGroupPassword}
                                onChange={e => setJoinGroupPassword(e.target.value)}
                            />
                            <button className="btn btn-primary" onClick={handleJoinGroup}>Katıl</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupsPage;

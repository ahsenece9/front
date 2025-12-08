import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import {
    Send, Search, Users, UserPlus, X, Check,
    MessageCircle, Circle, MoreVertical, Phone, Video,
    Smile, Paperclip, ArrowLeft, Settings, Moon, Sun, Image, Palette,
    Star, PhoneOff, Mic, MicOff, VideoOff, ArrowDownLeft, ArrowUpRight,
    Ban, Trash2, LogOut, Bell, BellOff
} from 'lucide-react';
import '../styles/Chat.css';

const API_URL = process.env.REACT_APP_API_URL || '';

// Wallpaper options with images
const WALLPAPERS = [
    { id: 'default', name: 'Varsayılan', type: 'gradient', value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
    { id: 'mountains', name: 'Dağlar', type: 'image', value: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80' },
    { id: 'ocean', name: 'Okyanus', type: 'image', value: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80' },
    { id: 'forest', name: 'Orman', type: 'image', value: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80' },
    { id: 'galaxy', name: 'Galaksi', type: 'image', value: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80' },
    { id: 'sunset', name: 'Gün Batımı', type: 'image', value: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&q=80' },
    { id: 'city', name: 'Şehir', type: 'image', value: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&q=80' },
    { id: 'aurora', name: 'Kuzey Işıkları', type: 'image', value: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80' },
];

// Color themes for messages
const COLOR_THEMES = [
    { id: 'purple', name: 'Mor', primary: '#8b5cf6', secondary: '#6366f1' },
    { id: 'blue', name: 'Mavi', primary: '#3b82f6', secondary: '#0ea5e9' },
    { id: 'green', name: 'Yeşil', primary: '#22c55e', secondary: '#10b981' },
    { id: 'pink', name: 'Pembe', primary: '#ec4899', secondary: '#f472b6' },
    { id: 'orange', name: 'Turuncu', primary: '#f97316', secondary: '#fb923c' },
    { id: 'red', name: 'Kırmızı', primary: '#ef4444', secondary: '#f87171' },
    { id: 'teal', name: 'Turkuaz', primary: '#14b8a6', secondary: '#2dd4bf' },
    { id: 'indigo', name: 'İndigo', primary: '#6366f1', secondary: '#818cf8' },
];

const ChatPage = () => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    // Theme & Customization
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [selectedWallpaper, setSelectedWallpaper] = useState('default');
    const [selectedColorTheme, setSelectedColorTheme] = useState('purple');
    const [showSettings, setShowSettings] = useState(false);

    // Options Menu
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [mutedChats, setMutedChats] = useState([]);

    // Friends & Conversations
    const [friends, setFriends] = useState([
        { id: 'f1', name: 'Ali Yılmaz', username: 'aliyilmaz', avatar: 'AY', online: true, lastMessage: 'Merhaba!', lastMessageTime: new Date(), unread: 2, isFavorite: true },
        { id: 'f2', name: 'Zeynep Demir', username: 'zeynepd', avatar: 'ZD', online: true, lastMessage: 'Proje nasıl gidiyor?', lastMessageTime: new Date(Date.now() - 3600000), unread: 0, isFavorite: false },
        { id: 'f3', name: 'Mehmet Kaya', username: 'mehmetk', avatar: 'MK', online: false, lastMessage: 'Görüşürüz!', lastMessageTime: new Date(Date.now() - 86400000), unread: 0, isFavorite: true },
        { id: 'f4', name: 'Ayşe Çelik', username: 'aysecelik', avatar: 'AÇ', online: true, lastMessage: 'Teşekkürler 😊', lastMessageTime: new Date(Date.now() - 7200000), unread: 1, isFavorite: false },
        { id: 'f5', name: 'Can Yıldız', username: 'canyildiz', avatar: 'CY', online: false, lastMessage: 'Tamam, anlaştık!', lastMessageTime: new Date(Date.now() - 172800000), unread: 0, isFavorite: false },
    ]);

    // Call States
    const [showCallModal, setShowCallModal] = useState(false);
    const [callType, setCallType] = useState('voice'); // 'voice' or 'video'
    const [callStatus, setCallStatus] = useState('calling'); // 'calling', 'connected', 'ended'
    const [callDuration, setCallDuration] = useState(0);
    const localVideoRef = useRef(null);

    // Call Effect for Camera
    useEffect(() => {
        let stream = null;
        const startCamera = async () => {
            if (showCallModal && callType === 'video') {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error("Kamera hatası:", err);
                    alert("Kamera erişimi sağlanamadı. Lütfen izinleri kontrol edin.");
                }
            }
        };
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [showCallModal, callType]);

    const [selectedFriend, setSelectedFriend] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Messages
    const [messages, setMessages] = useState({});
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Modals
    const [showNewMessageModal, setShowNewMessageModal] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);

    // Emoji & File Upload
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiTab, setEmojiTab] = useState('emoji'); // 'emoji' or 'sticker'
    const [emojiCategory, setEmojiCategory] = useState('smileys');
    const fileInputRef = useRef(null);

    // Emoji categories
    const emojiCategories = {
        smileys: {
            icon: '😀',
            name: 'Yüzler',
            emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '😮‍💨', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐']
        },
        emotions: {
            icon: '❤️',
            name: 'Duygular',
            emojis: ['😢', '😭', '😤', '😠', '😡', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟']
        },
        gestures: {
            icon: '👋',
            name: 'El Hareketleri',
            emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿']
        },
        objects: {
            icon: '🎉',
            name: 'Nesneler',
            emojis: ['🎉', '🎊', '🎁', '🎈', '🎀', '🎄', '🎃', '🎗️', '🎟️', '🎫', '🔮', '🧿', '🎮', '🕹️', '🎰', '🎲', '🧩', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '💾', '💿', '📀', '📷', '📹', '🎥', '📞', '☎️', '📺', '📻', '🎙️', '⏰', '⌚', '💰', '💵', '💴', '💶', '💷', '💎', '🔑', '🗝️']
        },
        nature: {
            icon: '🌸',
            name: 'Doğa',
            emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🌸', '🌺', '🌹', '🌷', '🌻', '🌼', '🍀', '🌿', '🌴', '🌵', '🌲', '🌳', '☀️', '🌙', '⭐', '🌈', '☁️', '⚡', '❄️', '🔥', '💧', '🌊']
        },
        food: {
            icon: '🍕',
            name: 'Yiyecek',
            emojis: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '☕', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉']
        },
        symbols: {
            icon: '💯',
            name: 'Semboller',
            emojis: ['💯', '✅', '❌', '❓', '❗', '💢', '💥', '💫', '💦', '💨', '🕳️', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜', '◼️', '◻️', '◾', '◽', '▪️', '▫️', '🔶', '🔷', '🔸', '🔹', '🔺', '🔻', '💠', '🔘', '🔳', '🔲', '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️']
        }
    };

    // Stickers - Expanded collection
    const stickers = [
        { id: 's1', name: 'Mutlu', url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif' },
        { id: 's2', name: 'Thumbs Up', url: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif' },
        { id: 's3', name: 'Kalp', url: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif' },
        { id: 's4', name: 'Kutlama', url: 'https://media.giphy.com/media/g9582DNuQppxC/giphy.gif' },
        { id: 's5', name: 'Alkış', url: 'https://media.giphy.com/media/l0MYJnJQ4EiYLxvQ4/giphy.gif' },
        { id: 's6', name: 'Wow', url: 'https://media.giphy.com/media/udmx3pgdiD7tm/giphy.gif' },
        { id: 's7', name: 'LOL', url: 'https://media.giphy.com/media/10JhviFuU2gWD6/giphy.gif' },
        { id: 's8', name: 'Teşekkür', url: 'https://media.giphy.com/media/osjgQPWRx3cac/giphy.gif' },
        { id: 's9', name: 'Dans', url: 'https://media.giphy.com/media/l0MYGb1LuZ3n7dRnO/giphy.gif' },
        { id: 's10', name: 'Cool', url: 'https://media.giphy.com/media/62PP2yEIAZF6g/giphy.gif' },
        { id: 's11', name: 'Üzgün', url: 'https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif' },
        { id: 's12', name: 'Aşk', url: 'https://media.giphy.com/media/l4pTdcifPZLpDjL1e/giphy.gif' },
        { id: 's13', name: 'Hi', url: 'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif' },
        { id: 's14', name: 'Evet!', url: 'https://media.giphy.com/media/l2JJKs3I69qfaQleE/giphy.gif' },
        { id: 's15', name: 'Hayır', url: 'https://media.giphy.com/media/3o7TKwmnDgQb5jemjK/giphy.gif' },
        { id: 's16', name: 'Güzel', url: 'https://media.giphy.com/media/8VrtCswiLDNnO/giphy.gif' },
        { id: 's17', name: 'Ağlıyor', url: 'https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif' },
        { id: 's18', name: 'Korkmuş', url: 'https://media.giphy.com/media/14ut8PhnIwzros/giphy.gif' },
        { id: 's19', name: 'Şaşkın', url: 'https://media.giphy.com/media/ukGm72ZLZvYfS/giphy.gif' },
        { id: 's20', name: 'Heyecanlı', url: 'https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif' },
        { id: 's21', name: 'Düşünüyor', url: 'https://media.giphy.com/media/a5viI92PAF89q/giphy.gif' },
        { id: 's22', name: 'Uykulu', url: 'https://media.giphy.com/media/xT8qBvH1pAhtfSx52U/giphy.gif' },
        { id: 's23', name: 'Kızgın', url: 'https://media.giphy.com/media/l1J9u3TZfpmeDLkD6/giphy.gif' },
        { id: 's24', name: 'Parti', url: 'https://media.giphy.com/media/l0MYJnJQ4EiYLxvQ4/giphy.gif' },
    ];

    // Favorite emojis
    const [favoriteEmojis, setFavoriteEmojis] = useState(['😀', '❤️', '👍', '🎉', '🔥', '😂', '✅', '💯', '😍', '🙏']);

    // Mock all users for search
    const allUsers = [
        { id: 'u1', name: 'Emre Öztürk', username: 'emreoz', avatar: 'EÖ', online: true },
        { id: 'u2', name: 'Selin Aksoy', username: 'selinaksoy', avatar: 'SA', online: false },
        { id: 'u3', name: 'Burak Şahin', username: 'buraksahin', avatar: 'BŞ', online: true },
        { id: 'u4', name: 'Elif Yıldırım', username: 'elifyildirim', avatar: 'EY', online: true },
        { id: 'u5', name: 'Oğuz Han', username: 'oguzhan', avatar: 'OH', online: false },
    ];

    // Get current theme colors
    const currentTheme = COLOR_THEMES.find(t => t.id === selectedColorTheme) || COLOR_THEMES[0];
    const currentWallpaper = WALLPAPERS.find(w => w.id === selectedWallpaper) || WALLPAPERS[0];

    // Initialize mock messages
    useEffect(() => {
        const mockMessages = {
            'f1': [
                { id: 1, content: 'Selam!', senderId: 'f1', time: '10:30', isMe: false },
                { id: 2, content: 'Selam, nasılsın?', senderId: 'me', time: '10:31', isMe: true },
                { id: 3, content: 'İyiyim, sen?', senderId: 'f1', time: '10:32', isMe: false },
                { id: 4, content: 'Merhaba!', senderId: 'f1', time: '10:35', isMe: false },
            ],
            'f2': [
                { id: 1, content: 'Proje nasıl gidiyor?', senderId: 'f2', time: '09:00', isMe: false },
            ],
            'f4': [
                { id: 1, content: 'Yardımın için teşekkürler!', senderId: 'me', time: '14:20', isMe: true },
                { id: 2, content: 'Teşekkürler 😊', senderId: 'f4', time: '14:25', isMe: false },
            ]
        };
        setMessages(mockMessages);

        // Load saved preferences
        const savedTheme = localStorage.getItem('chatColorTheme');
        const savedWallpaper = localStorage.getItem('chatWallpaper');
        const savedDarkMode = localStorage.getItem('chatDarkMode');
        if (savedTheme) setSelectedColorTheme(savedTheme);
        if (savedWallpaper) setSelectedWallpaper(savedWallpaper);
        if (savedDarkMode !== null) setIsDarkMode(savedDarkMode === 'true');
    }, []);

    // Save preferences
    useEffect(() => {
        localStorage.setItem('chatColorTheme', selectedColorTheme);
        localStorage.setItem('chatWallpaper', selectedWallpaper);
        localStorage.setItem('chatDarkMode', isDarkMode.toString());
    }, [selectedColorTheme, selectedWallpaper, isDarkMode]);

    // Socket connection
    useEffect(() => {
        if (!user) return;
        const socketUrl = API_URL || window.location.origin;
        const newSocket = io(socketUrl, {
            transports: ['websocket', 'polling']
        });
        newSocket.on('connect', () => setIsConnected(true));
        newSocket.on('disconnect', () => setIsConnected(false));
        setSocket(newSocket);
        return () => newSocket.close();
    }, [user]);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedFriend]);

    // Search users
    const handleUserSearch = (query) => {
        setUserSearchQuery(query);
        if (query.length > 0) {
            const results = allUsers.filter(u =>
                u.name.toLowerCase().includes(query.toLowerCase()) ||
                u.username.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    // Send message request
    const sendMessageRequest = (user) => {
        setPendingRequests([...pendingRequests, user.id]);
        setTimeout(() => {
            alert(`${user.name} kişisine mesaj isteği gönderildi!`);
        }, 500);
    };

    // Send message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !selectedFriend) return;

        const newMessage = {
            id: Date.now(),
            content: inputMessage.trim(),
            senderId: 'me',
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };

        setMessages(prev => ({
            ...prev,
            [selectedFriend.id]: [...(prev[selectedFriend.id] || []), newMessage]
        }));

        setFriends(prev => prev.map(f =>
            f.id === selectedFriend.id
                ? { ...f, lastMessage: inputMessage.trim(), lastMessageTime: new Date(), unread: 0 }
                : f
        ));

        setInputMessage('');
        setShowEmojiPicker(false);

        if (socket) {
            socket.emit('send_message', {
                sender_id: user?.id,
                sender_name: user?.full_name,
                content: inputMessage.trim(),
                receiver_id: selectedFriend.id
            });
        }
    };

    // Add emoji to message
    const addEmoji = (emoji) => {
        setInputMessage(prev => prev + emoji);
    };

    // Send sticker
    const sendSticker = (sticker) => {
        if (!selectedFriend) return;

        const newMessage = {
            id: Date.now(),
            content: '',
            sticker: sticker.url,
            stickerName: sticker.name,
            senderId: 'me',
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };

        setMessages(prev => ({
            ...prev,
            [selectedFriend.id]: [...(prev[selectedFriend.id] || []), newMessage]
        }));

        setFriends(prev => prev.map(f =>
            f.id === selectedFriend.id
                ? { ...f, lastMessage: `🎭 ${sticker.name}`, lastMessageTime: new Date() }
                : f
        ));

        setShowEmojiPicker(false);
    };

    // Handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file || !selectedFriend) return;

        const isImage = file.type.startsWith('image/');
        const reader = new FileReader();

        reader.onload = (event) => {
            const newMessage = {
                id: Date.now(),
                content: isImage ? '' : `📎 ${file.name}`,
                image: isImage ? event.target.result : null,
                fileName: !isImage ? file.name : null,
                senderId: 'me',
                time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                isMe: true
            };

            setMessages(prev => ({
                ...prev,
                [selectedFriend.id]: [...(prev[selectedFriend.id] || []), newMessage]
            }));

            setFriends(prev => prev.map(f =>
                f.id === selectedFriend.id
                    ? { ...f, lastMessage: isImage ? '📷 Fotoğraf' : `📎 ${file.name}`, lastMessageTime: new Date() }
                    : f
            ));
        };

        reader.readAsDataURL(file);
        e.target.value = '';
    };

    // Start a call
    const startCall = (type) => {
        if (!selectedFriend) return;
        setCallType(type);
        setCallStatus('calling');
        setCallDuration(0);
        setShowCallModal(true);

        setTimeout(() => {
            setCallStatus('connected');
            const timer = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
            window.callTimer = timer;
        }, 2000);
    };

    // Recent Calls
    const [recentCalls, setRecentCalls] = useState([
        { id: 'c1', userId: 'f1', name: 'Ali Yılmaz', avatar: 'AY', type: 'voice', duration: '05:23', time: new Date(Date.now() - 3600000), status: 'incoming' },
        { id: 'c2', userId: 'f2', name: 'Zeynep Demir', avatar: 'ZD', type: 'video', duration: '12:45', time: new Date(Date.now() - 86400000), status: 'outgoing' },
    ]);

    // End call
    const endCall = () => {
        if (window.callTimer) {
            clearInterval(window.callTimer);
        }

        if (selectedFriend) {
            const durationFormatted = formatDuration(callDuration);
            const callLogMessage = {
                id: Date.now(),
                content: `${callType === 'video' ? 'Görüntülü Arama' : 'Sesli Arama'} - ${durationFormatted}`,
                type: 'call-log',
                callType: callType,
                duration: durationFormatted,
                senderId: 'me',
                time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                isMe: true
            };

            setMessages(prev => ({
                ...prev,
                [selectedFriend.id]: [...(prev[selectedFriend.id] || []), callLogMessage]
            }));

            const newCall = {
                id: Date.now(),
                userId: selectedFriend.id,
                name: selectedFriend.name,
                avatar: selectedFriend.avatar,
                type: callType,
                duration: durationFormatted,
                time: new Date(),
                status: 'outgoing'
            };

            setRecentCalls(prev => [newCall, ...prev]);

            setFriends(prev => prev.map(f =>
                f.id === selectedFriend.id
                    ? { ...f, lastMessage: `${callType === 'video' ? '📹' : '📞'} Arama (${durationFormatted})`, lastMessageTime: new Date() }
                    : f
            ));
        }

        setCallStatus('ended');
        setTimeout(() => {
            setShowCallModal(false);
            setCallStatus('calling');
            setCallDuration(0);
        }, 1000);
    };

    // Filter Logic
    const filteredFriends = filter === 'calls'
        ? []
        : friends.filter(f => {
            const matchesFilter = filter === 'all' ||
                (filter === 'online' && f.online) ||
                (filter === 'favorites' && f.isFavorite);
            const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.username.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });

    // Format call duration
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Toggle favorite
    const toggleFavorite = (friendId) => {
        setFriends(prev => prev.map(f =>
            f.id === friendId ? { ...f, isFavorite: !f.isFavorite } : f
        ));
    };

    // Toggle block user
    const toggleBlock = (friendId) => {
        if (blockedUsers.includes(friendId)) {
            setBlockedUsers(prev => prev.filter(id => id !== friendId));
        } else {
            setBlockedUsers(prev => [...prev, friendId]);
        }
        setShowOptionsMenu(false);
    };

    // Toggle mute chat
    const toggleMuteChat = (friendId) => {
        if (mutedChats.includes(friendId)) {
            setMutedChats(prev => prev.filter(id => id !== friendId));
        } else {
            setMutedChats(prev => [...prev, friendId]);
        }
        setShowOptionsMenu(false);
    };

    // Delete chat
    const deleteChat = (friendId) => {
        if (window.confirm('Bu sohbeti silmek istediğinizden emin misiniz?')) {
            setMessages(prev => {
                const newMessages = { ...prev };
                delete newMessages[friendId];
                return newMessages;
            });
            setFriends(prev => prev.map(f =>
                f.id === friendId ? { ...f, lastMessage: '', unread: 0 } : f
            ));
            setShowOptionsMenu(false);
        }
    };

    // Remove chat from list
    const removeChat = (friendId) => {
        if (window.confirm('Bu kişiyi sohbet listenizden çıkarmak istediğinizden emin misiniz?')) {
            setFriends(prev => prev.filter(f => f.id !== friendId));
            setMessages(prev => {
                const newMessages = { ...prev };
                delete newMessages[friendId];
                return newMessages;
            });
            setSelectedFriend(null);
            setShowOptionsMenu(false);
        }
    };

    // Get time ago text
    const getTimeAgo = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (minutes < 1) return 'Şimdi';
        if (minutes < 60) return `${minutes}d`;
        if (hours < 24) return `${hours}s`;
        return `${days}g`;
    };

    // Get wallpaper style
    const getWallpaperStyle = () => {
        if (currentWallpaper.type === 'image') {
            return {
                backgroundImage: `url(${currentWallpaper.value})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            };
        }
        return { background: currentWallpaper.value };
    };

    // Dynamic styles
    const containerStyle = {
        '--theme-primary': currentTheme.primary,
        '--theme-secondary': currentTheme.secondary,
    };

    if (!user) {
        return (
            <div className={`chat-login-prompt ${isDarkMode ? 'dark' : 'light'}`}>
                <MessageCircle size={64} />
                <h2>Giriş Yapın</h2>
                <p>Sohbetlere erişmek için lütfen giriş yapın</p>
            </div>
        );
    }

    return (
        <div
            className={`modern-chat-container ${isDarkMode ? 'dark' : 'light'}`}
            style={containerStyle}
        >
            {/* Sidebar */}
            <div className="chat-sidebar-modern">
                <div className="sidebar-header">
                    <h1>Sohbetler</h1>
                    <div className="header-actions">
                        <button
                            className="icon-button"
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            title={isDarkMode ? 'Gündüz Modu' : 'Gece Modu'}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            className="icon-button"
                            onClick={() => setShowSettings(true)}
                            title="Özelleştir"
                        >
                            <Palette size={20} />
                        </button>
                        <button
                            className="new-message-btn"
                            onClick={() => setShowNewMessageModal(true)}
                            title="Yeni Mesaj"
                        >
                            <UserPlus size={20} />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="sidebar-search">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder={filter === 'calls' ? "Arama geçmişinde ara..." : "Sohbet ara..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filter Tabs */}
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Tümü
                    </button>
                    <button
                        className={`filter-tab ${filter === 'online' ? 'active' : ''}`}
                        onClick={() => setFilter('online')}
                    >
                        <Circle size={8} fill="#22c55e" className="online-dot" />
                        Çevrimiçi
                    </button>
                    <button
                        className={`filter-tab ${filter === 'favorites' ? 'active' : ''}`}
                        onClick={() => setFilter('favorites')}
                    >
                        <Star size={14} fill={filter === 'favorites' ? 'currentColor' : 'none'} />
                    </button>
                    <button
                        className={`filter-tab ${filter === 'calls' ? 'active' : ''}`}
                        onClick={() => setFilter('calls')}
                    >
                        <Phone size={14} />
                    </button>
                </div>

                {/* Friends List */}
                <div className="friends-list">
                    {filter === 'calls' ? (
                        recentCalls.length === 0 ? (
                            <div className="no-friends">
                                <Phone size={40} />
                                <p>Arama geçmişi boş</p>
                            </div>
                        ) : (
                            recentCalls.map(call => (
                                <div key={call.id} className="friend-card call-card">
                                    <div className="friend-avatar-wrapper">
                                        <div className="friend-avatar" style={{
                                            background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                                        }}>{call.avatar}</div>
                                        <div className="call-type-indicator">
                                            {call.type === 'video' ? <Video size={12} /> : <Phone size={12} />}
                                        </div>
                                    </div>
                                    <div className="friend-details">
                                        <div className="friend-header">
                                            <span className="friend-name">{call.name}</span>
                                            <span className="message-time">{getTimeAgo(call.time)}</span>
                                        </div>
                                        <div className="friend-footer">
                                            <span className="last-message call-info">
                                                {call.status === 'incoming' ? <ArrowDownLeft size={14} color="#22c55e" /> : <ArrowUpRight size={14} color="#ef4444" />}
                                                <span style={{ marginLeft: 4 }}>{call.duration}</span>
                                            </span>
                                            <button className="call-again-btn" onClick={(e) => {
                                                e.stopPropagation();
                                                const friend = friends.find(f => f.id === call.userId);
                                                if (friend) {
                                                    setSelectedFriend(friend);
                                                    startCall(call.type);
                                                }
                                            }}>
                                                <Phone size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    ) : (
                        filteredFriends.length === 0 ? (
                            <div className="no-friends">
                                <Users size={40} />
                                <p>{filter === 'online' ? 'Çevrimiçi arkadaş yok' : 'Sohbet bulunamadı'}</p>
                            </div>
                        ) : (
                            filteredFriends.map(friend => (
                                <div
                                    key={friend.id}
                                    className={`friend-card ${selectedFriend?.id === friend.id ? 'selected' : ''}`}
                                    onClick={() => {
                                        setSelectedFriend(friend);
                                        setFriends(prev => prev.map(f =>
                                            f.id === friend.id ? { ...f, unread: 0 } : f
                                        ));
                                    }}
                                >
                                    <div className="friend-avatar-wrapper">
                                        <div className="friend-avatar" style={{
                                            background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                                        }}>{friend.avatar}</div>
                                        {friend.online && <div className="online-indicator" />}
                                    </div>
                                    <div className="friend-details">
                                        <div className="friend-header">
                                            <span className="friend-name">{friend.name}</span>
                                            <span className="message-time">{getTimeAgo(friend.lastMessageTime)}</span>
                                        </div>
                                        <div className="friend-footer">
                                            <span className="last-message">{friend.lastMessage}</span>
                                            {friend.unread > 0 && (
                                                <span className="unread-badge" style={{
                                                    background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                                                }}>{friend.unread}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className="chat-window-modern" style={getWallpaperStyle()}>
                {!selectedFriend ? (
                    <div className="no-chat-selected">
                        <div className="no-chat-icon" style={{
                            background: `linear-gradient(135deg, ${currentTheme.primary}20, ${currentTheme.secondary}20)`,
                            color: currentTheme.primary
                        }}>
                            <MessageCircle size={80} />
                        </div>
                        <h2>Sohbet Seçin</h2>
                        <p>Mesajlaşmaya başlamak için bir sohbet seçin</p>
                        <button
                            className="start-chat-btn"
                            onClick={() => setShowNewMessageModal(true)}
                            style={{
                                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                            }}
                        >
                            <UserPlus size={20} />
                            Yeni Sohbet Başlat
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="chat-header-modern">
                            <button
                                className="back-btn mobile-only"
                                onClick={() => setSelectedFriend(null)}
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <div className="chat-user-info">
                                <div className="friend-avatar-wrapper">
                                    <div className="friend-avatar" style={{
                                        background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                                    }}>{selectedFriend.avatar}</div>
                                    {selectedFriend.online && <div className="online-indicator" />}
                                </div>
                                <div>
                                    <h3>{selectedFriend.name}</h3>
                                    <span className={`status ${selectedFriend.online ? 'online' : 'offline'}`}>
                                        {selectedFriend.online ? 'Çevrimiçi' : 'Çevrimdışı'}
                                    </span>
                                </div>
                            </div>
                            <div className="chat-actions">
                                <button className="action-btn" onClick={() => startCall('voice')} title="Sesli Arama">
                                    <Phone size={20} />
                                </button>
                                <button className="action-btn" onClick={() => startCall('video')} title="Görüntülü Arama">
                                    <Video size={20} />
                                </button>
                                <button
                                    className="action-btn"
                                    onClick={() => toggleFavorite(selectedFriend.id)}
                                    title={selectedFriend.isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                                >
                                    <Star size={20} fill={selectedFriend.isFavorite ? 'currentColor' : 'none'} color={selectedFriend.isFavorite ? '#fbbf24' : 'currentColor'} />
                                </button>
                                <div className="options-menu-wrapper">
                                    <button
                                        className="action-btn"
                                        onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                                    >
                                        <MoreVertical size={20} />
                                    </button>
                                    {showOptionsMenu && (
                                        <div className="options-dropdown">
                                            <button
                                                className="options-dropdown-item"
                                                onClick={() => toggleMuteChat(selectedFriend.id)}
                                            >
                                                {mutedChats.includes(selectedFriend.id) ? <Bell size={16} /> : <BellOff size={16} />}
                                                {mutedChats.includes(selectedFriend.id) ? 'Bildirimleri Aç' : 'Bildirimleri Kapat'}
                                            </button>
                                            <button
                                                className="options-dropdown-item"
                                                onClick={() => toggleBlock(selectedFriend.id)}
                                            >
                                                <Ban size={16} />
                                                {blockedUsers.includes(selectedFriend.id) ? 'Engeli Kaldır' : 'Engelle'}
                                            </button>
                                            <button
                                                className="options-dropdown-item"
                                                onClick={() => deleteChat(selectedFriend.id)}
                                            >
                                                <Trash2 size={16} />
                                                Sohbeti Sil
                                            </button>
                                            <button
                                                className="options-dropdown-item danger"
                                                onClick={() => removeChat(selectedFriend.id)}
                                            >
                                                <LogOut size={16} />
                                                Sohbetten Ayrıl
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="messages-container" onClick={() => setShowEmojiPicker(false)}>
                            {(messages[selectedFriend.id] || []).map(msg => {
                                if (msg.type === 'call-log') {
                                    return (
                                        <div key={msg.id} className="message-call-log">
                                            <div className="call-log-content">
                                                {msg.callType === 'video' ? <Video size={16} /> : <Phone size={16} />}
                                                <span>{msg.content}</span>
                                            </div>
                                            <span className="call-log-time">{msg.time}</span>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={msg.id}
                                        className={`message-bubble ${msg.isMe ? 'sent' : 'received'} ${msg.image || msg.sticker ? 'has-image' : ''}`}
                                        style={msg.isMe && !msg.image && !msg.sticker ? {
                                            background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                                        } : {}}
                                    >
                                        {msg.image && (
                                            <img src={msg.image} alt="Fotoğraf" className="message-image" />
                                        )}
                                        {msg.sticker && (
                                            <img src={msg.sticker} alt={msg.stickerName} className="message-sticker" />
                                        )}
                                        {msg.content && <p>{msg.content}</p>}
                                        <span className="message-time">{msg.time}</span>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Emoji & Sticker Picker */}
                        {showEmojiPicker && (
                            <div className="emoji-picker-full">
                                {/* Tabs */}
                                <div className="picker-tabs">
                                    <button
                                        className={`picker-tab ${emojiTab === 'emoji' ? 'active' : ''}`}
                                        onClick={() => setEmojiTab('emoji')}
                                    >
                                        😀 Emoji
                                    </button>
                                    <button
                                        className={`picker-tab ${emojiTab === 'sticker' ? 'active' : ''}`}
                                        onClick={() => setEmojiTab('sticker')}
                                    >
                                        🎭 Çıkartma
                                    </button>
                                    <button
                                        className="close-picker"
                                        onClick={() => setShowEmojiPicker(false)}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {emojiTab === 'emoji' ? (
                                    <>
                                        {/* Category Buttons with Favorites */}
                                        <div className="emoji-categories">
                                            <button
                                                className={`category-btn ${emojiCategory === 'favorites' ? 'active' : ''}`}
                                                onClick={() => setEmojiCategory('favorites')}
                                                title="Favoriler"
                                            >
                                                ⭐
                                            </button>
                                            {Object.entries(emojiCategories).map(([key, cat]) => (
                                                <button
                                                    key={key}
                                                    className={`category-btn ${emojiCategory === key ? 'active' : ''}`}
                                                    onClick={() => setEmojiCategory(key)}
                                                    title={cat.name}
                                                >
                                                    {cat.icon}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Emoji Grid */}
                                        <div className="emoji-grid-large">
                                            {emojiCategory === 'favorites' ? (
                                                favoriteEmojis.length > 0 ? (
                                                    favoriteEmojis.map((emoji, index) => (
                                                        <button
                                                            key={index}
                                                            className="emoji-btn"
                                                            onClick={() => addEmoji(emoji)}
                                                            onContextMenu={(e) => {
                                                                e.preventDefault();
                                                                setFavoriteEmojis(prev => prev.filter(e => e !== emoji));
                                                            }}
                                                            title="Sol tık: Ekle | Sağ tık: Favorilerden çıkar"
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="no-favorites">
                                                        <span>Henüz favori emoji yok</span>
                                                        <small>Emoji üzerine çift tıklayarak favorilere ekle</small>
                                                    </div>
                                                )
                                            ) : (
                                                emojiCategories[emojiCategory]?.emojis.map((emoji, index) => (
                                                    <button
                                                        key={index}
                                                        className={`emoji-btn ${favoriteEmojis.includes(emoji) ? 'is-favorite' : ''}`}
                                                        onClick={() => addEmoji(emoji)}
                                                        onDoubleClick={() => {
                                                            if (!favoriteEmojis.includes(emoji)) {
                                                                setFavoriteEmojis(prev => [...prev, emoji]);
                                                            }
                                                        }}
                                                        title="Tek tık: Ekle | Çift tık: Favorilere ekle"
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    /* Sticker Grid */
                                    <div className="sticker-grid-large">
                                        {stickers.map(sticker => (
                                            <button
                                                key={sticker.id}
                                                className="sticker-btn"
                                                onClick={() => sendSticker(sticker)}
                                                title={sticker.name}
                                            >
                                                <img src={sticker.url} alt={sticker.name} />
                                                <span className="sticker-name">{sticker.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Input */}
                        <form className="message-input-container" onSubmit={handleSendMessage}>
                            {/* Hidden file input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*,.pdf,.doc,.docx,.txt"
                                style={{ display: 'none' }}
                            />
                            <button
                                type="button"
                                className="input-action-btn"
                                onClick={() => fileInputRef.current?.click()}
                                title="Dosya/Fotoğraf Ekle"
                            >
                                <Paperclip size={20} />
                            </button>
                            <input
                                type="text"
                                placeholder="Mesaj yazın..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                            />
                            <button
                                type="button"
                                className={`input-action-btn ${showEmojiPicker ? 'active' : ''}`}
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                title="Emoji Ekle"
                            >
                                <Smile size={20} />
                            </button>
                            <button
                                type="submit"
                                className="send-message-btn"
                                disabled={!inputMessage.trim()}
                                style={{
                                    background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                                }}
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                )}
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="modal-overlay" onClick={() => setShowSettings(false)}>
                    <div className="settings-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Özelleştir</h2>
                            <button className="close-btn" onClick={() => setShowSettings(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Theme Toggle */}
                        <div className="settings-section">
                            <h3>Tema</h3>
                            <div className="theme-toggle">
                                <button
                                    className={`theme-option ${!isDarkMode ? 'active' : ''}`}
                                    onClick={() => setIsDarkMode(false)}
                                >
                                    <Sun size={24} />
                                    <span>Gündüz</span>
                                </button>
                                <button
                                    className={`theme-option ${isDarkMode ? 'active' : ''}`}
                                    onClick={() => setIsDarkMode(true)}
                                >
                                    <Moon size={24} />
                                    <span>Gece</span>
                                </button>
                            </div>
                        </div>

                        {/* Color Theme */}
                        <div className="settings-section">
                            <h3>Mesaj Rengi</h3>
                            <div className="color-options">
                                {COLOR_THEMES.map(theme => (
                                    <button
                                        key={theme.id}
                                        className={`color-option ${selectedColorTheme === theme.id ? 'active' : ''}`}
                                        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                                        onClick={() => setSelectedColorTheme(theme.id)}
                                        title={theme.name}
                                    >
                                        {selectedColorTheme === theme.id && <Check size={16} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Wallpaper */}
                        <div className="settings-section">
                            <h3>Duvar Kağıdı</h3>
                            <div className="wallpaper-options">
                                {WALLPAPERS.map(wp => (
                                    <button
                                        key={wp.id}
                                        className={`wallpaper-option ${selectedWallpaper === wp.id ? 'active' : ''}`}
                                        style={wp.type === 'image'
                                            ? { backgroundImage: `url(${wp.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                                            : { background: wp.value }
                                        }
                                        onClick={() => setSelectedWallpaper(wp.id)}
                                    >
                                        <span>{wp.name}</span>
                                        {selectedWallpaper === wp.id && <Check size={16} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New Message Modal */}
            {showNewMessageModal && (
                <div className="modal-overlay" onClick={() => setShowNewMessageModal(false)}>
                    <div className="new-message-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Yeni Mesaj</h2>
                            <button className="close-btn" onClick={() => setShowNewMessageModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-search">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Kullanıcı adı ile ara..."
                                value={userSearchQuery}
                                onChange={(e) => handleUserSearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="search-results">
                            {userSearchQuery.length === 0 ? (
                                <div className="search-hint">
                                    <Search size={40} />
                                    <p>Mesaj göndermek istediğiniz kişinin kullanıcı adını yazın</p>
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="no-results">
                                    <p>"{userSearchQuery}" için sonuç bulunamadı</p>
                                </div>
                            ) : (
                                searchResults.map(user => (
                                    <div key={user.id} className="search-result-item">
                                        <div className="friend-avatar-wrapper">
                                            <div className="friend-avatar" style={{
                                                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                                            }}>{user.avatar}</div>
                                            {user.online && <div className="online-indicator" />}
                                        </div>
                                        <div className="user-info">
                                            <span className="user-name">{user.name}</span>
                                            <span className="user-username">@{user.username}</span>
                                        </div>
                                        <button
                                            className={`request-btn ${pendingRequests.includes(user.id) ? 'sent' : ''}`}
                                            onClick={() => sendMessageRequest(user)}
                                            disabled={pendingRequests.includes(user.id)}
                                            style={!pendingRequests.includes(user.id) ? {
                                                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                                            } : {}}
                                        >
                                            {pendingRequests.includes(user.id) ? (
                                                <>
                                                    <Check size={16} />
                                                    Gönderildi
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={16} />
                                                    İstek Gönder
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Call Modal */}
            {showCallModal && (
                <div className="call-modal-overlay">
                    <div className="call-modal">
                        <div className="call-header">
                            <div className="call-status">
                                {callStatus === 'calling' ? 'Aranıyor...' : callStatus === 'ended' ? 'Arama Sonlandı' : 'Bağlandı'}
                            </div>
                            {callStatus === 'connected' && (
                                <div className="call-duration">{formatDuration(callDuration)}</div>
                            )}
                        </div>
                        <div className="call-user-info">
                            {callType === 'video' ? (
                                <div className="call-video-container">
                                    <video
                                        ref={localVideoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className="call-video"
                                    />
                                    <div className="call-overlay-name">{selectedFriend?.name}</div>
                                </div>
                            ) : (
                                <>
                                    <div className="call-avatar-wrapper">
                                        <div className="call-avatar" style={{
                                            background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                                        }}>
                                            {selectedFriend?.avatar}
                                        </div>
                                        <div className="call-avatar-pulse" style={{ borderColor: currentTheme.primary }}></div>
                                    </div>
                                    <h2>{selectedFriend?.name}</h2>
                                </>
                            )}
                            <p>{callType === 'video' ? 'Görüntülü Arama' : 'Sesli Arama'}</p>
                        </div>
                        <div className="call-controls">
                            <button className="control-btn" title="Mikrofon">
                                <Mic size={24} />
                            </button>
                            {callType === 'video' && (
                                <button className="control-btn" title="Kamera">
                                    <Video size={24} />
                                </button>
                            )}
                            <button className="control-btn end-call" onClick={endCall} title="Sonlandır">
                                <PhoneOff size={28} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPage;

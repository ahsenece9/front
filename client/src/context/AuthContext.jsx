import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error('Failed to fetch user');
                })
                .then(data => {
                    setUser(data.user);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const signUp = async (email, password, metaData) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, full_name: metaData.full_name })
            });

            let data = null;
            try {
                const contentType = res.headers.get('content-type') || '';
                if (contentType.includes('application/json')) {
                    data = await res.json().catch(() => null);
                }
            } catch (e) {
                // If parsing fails we still fall through to friendly fallback
                data = null;
            }

            if (!res.ok) {
                const msg = (data && (data.error || data.message)) || res.statusText || 'Registration failed';
                throw new Error(msg);
            }
            return { data };
        } catch (error) {
            return { error };
        }
    };

    const signIn = async (email, password) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            let data = null;
            try {
                const contentType = res.headers.get('content-type') || '';
                if (contentType.includes('application/json')) {
                    data = await res.json().catch(() => null);
                }
            } catch (e) {
                data = null;
            }

            if (!res.ok) {
                const msg = (data && (data.error || data.message)) || res.statusText || 'Login failed';
                throw new Error(msg);
            }

            localStorage.setItem('token', data.token);
            setUser(data.user);
            return { data };
        } catch (error) {
            return { error };
        }
    };

    const signOut = async () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        signUp,
        signIn,
        signOut,
        user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

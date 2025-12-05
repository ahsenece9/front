import React, { useState } from 'react';

const API_URL = 'https://uniplan-3kax.onrender.com';

export default function App() {
  const [page, setPage] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        setPage('login');
        setEmail('');
        setPassword('');
      } else {
        setError(data.error || 'Kayıt başarısız');
      }
    } catch (err) {
      setError('Bağlantı hatası: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUser(data.user);
        setPage('home');
      } else {
        setError(data.error || 'Giriş başarısız');
      }
    } catch (err) {
      setError('Bağlantı hatası: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPage('login');
    setEmail('');
    setPassword('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (page === 'login') handleLogin();
      else handleRegister();
    }
  };

  if (page === 'home' && user) {
    return (
      <div style={{ padding: '40px', fontFamily: 'Arial' }}>
        <h1>Ana Sayfa</h1>
        <p>Hoş geldin, {user.email}!</p>
        <p>Başarıyla giriş yaptın.</p>
        <button onClick={handleLogout} style={{ 
          padding: '10px 20px', 
          cursor: 'pointer',
          border: '1px solid black',
          background: 'white'
        }}>
          Çıkış Yap
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '400px', 
      margin: '0 auto',
      fontFamily: 'Arial'
    }}>
      <h1>{page === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</h1>
      
      <div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ 
              width: '100%', 
              padding: '8px',
              border: '1px solid black',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Şifre:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ 
              width: '100%', 
              padding: '8px',
              border: '1px solid black',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {error && (
          <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>
        )}

        <button 
          onClick={page === 'login' ? handleLogin : handleRegister}
          disabled={loading || !email || !password}
          style={{ 
            width: '100%',
            padding: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            border: '1px solid black',
            background: 'white',
            marginBottom: '10px'
          }}
        >
          {loading ? 'Yükleniyor...' : (page === 'login' ? 'Giriş Yap' : 'Kayıt Ol')}
        </button>
      </div>

      <button
        onClick={() => {
          setPage(page === 'login' ? 'register' : 'login');
          setError('');
        }}
        style={{ 
          background: 'none',
          border: 'none',
          textDecoration: 'underline',
          cursor: 'pointer'
        }}
      >
        {page === 'login' ? 'Hesabın yok mu? Kayıt ol' : 'Zaten hesabın var mı? Giriş yap'}
      </button>
    </div>
  );
}
import { useState } from "react";
import { register, login } from "./api/auth";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      const res = await register(username, password);
      setMessage(res.data.message);
    } catch (e) {
      setMessage("Hata: " + e.response?.data?.error);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await login(username, password);
      setMessage(res.data.message);
    } catch (e) {
      setMessage("Hata: " + e.response?.data?.error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Kayıt / Giriş Testi</h1>

      <input
        placeholder="Kullanıcı adı"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="Şifre"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>Kayıt Ol</button>
      <button onClick={handleLogin}>Giriş Yap</button>

      <p>{message}</p>
    </div>
  );
}

export default App;

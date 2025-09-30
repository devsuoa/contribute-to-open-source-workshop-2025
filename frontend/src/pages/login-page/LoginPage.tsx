import StatusBar from "@/components/shared-components/status-bar/StatusBar";
import Logo from "@/assets/logo-no-text.svg";
import styles from "./LoginPage.module.css";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  const { setUserId, setUserToken, saveToLocalStorage } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/login`,
        { username, password },
        { withCredentials: true },
      );
      setUserId(res.data.userId);
      setUserToken(res.data.token);
      saveToLocalStorage(res.data.userId, res.data.token);
      window.location.href = "/"; // Redirect after login
    } catch (err) {
      console.log(err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.statusBar}>
        <StatusBar />
      </div>

      <div className={styles.content}>
        <img src={Logo} alt="Logo" className={styles.logo} />
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          {error && <div className={styles.error}>{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

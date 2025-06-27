import StatusBar from "@/components/shared-components/status-bar/StatusBar";
import GoogleSignInButton from "@/components/login-components/google-sign-in-button/GoogleSignInButton";
import Logo from "@/assets/logo-no-text.svg";
import styles from "./LoginPage.module.css";

const LoginPage = () => (
  <div className={styles.page}>
    <div className={styles.statusBar}>
      <StatusBar />
    </div>

    <div className={styles.content}>
      <img src={Logo} alt="Logo" className={styles.logo} />
      <GoogleSignInButton />
    </div>
  </div>
);

export default LoginPage;

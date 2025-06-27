import styles from "./StatusBar.module.css";
import Logo from "@/assets/logo-white-text.svg";

const StatusBar = () => {
  return (
    <div className={styles.statusBar}>
      <img src={Logo} alt="Statusbar Logo" className={styles.logo} />
    </div>
  );
};

export default StatusBar;

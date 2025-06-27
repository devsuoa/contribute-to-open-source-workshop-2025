import styles from "./ProblemHeader.module.css";
import Logo from "@/assets/logo-white-text.svg";

const QuestionHeader = () => {
  return (
    <div className={styles.header}>
      <img src={Logo} alt="Header Logo" className={styles.logo} />
    </div>
  );
};

export default QuestionHeader;

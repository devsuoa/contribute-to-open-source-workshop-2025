import styles from "./ProblemConsoleCard.module.css";

export default function ProblemConsoleCard() {
  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>Console</h2>
      <div className={styles.scrollArea}></div>
    </div>
  );
}

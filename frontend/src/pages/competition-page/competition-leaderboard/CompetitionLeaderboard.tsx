import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import styles from "./CompetitionLeaderboard.module.css";
import Leaderboard from "@/components/competition-components/leaderboard/Leaderboard";

const CompetitionLeaderboard = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <button onClick={() => navigate("/home")} className={styles.backButton}>
          <FontAwesomeIcon icon={faHouse} className={styles.icon} />
        </button>

        <h1 className={styles.heading}>Leaderboard</h1>
      </div>
      <Leaderboard />
    </div>
  );
};

export default CompetitionLeaderboard;

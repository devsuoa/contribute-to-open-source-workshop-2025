import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import styles from "./CompetitionDocumentation.module.css";

const CompetitionDocumentation = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <button onClick={() => navigate("/home")} className={styles.backButton}>
          <FontAwesomeIcon icon={faHouse} className={styles.icon} />
        </button>

        <h1 className={styles.heading}>Documentation</h1>
      </div>

      <p>Documentation content will be displayed here.</p>
    </div>
  );
};

export default CompetitionDocumentation;

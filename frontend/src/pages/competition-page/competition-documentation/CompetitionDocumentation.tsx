import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";
import styles from "./CompetitionDocumentation.module.css";
import { useEffect, useState } from "react";

const CompetitionDocumentation = () => {
  const navigate = useNavigate();

  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch("/README.md")
      .then((res) => res.text())
      .then(setMarkdown);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <button onClick={() => navigate("/home")} className={styles.backButton}>
          <FontAwesomeIcon icon={faHouse} className={styles.icon} />
        </button>
        <h1 className={styles.heading}>Documentation</h1>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <div className={styles.scrollableContainer}>
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default CompetitionDocumentation;

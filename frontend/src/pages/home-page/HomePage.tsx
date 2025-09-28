import StatusBarProfile from "@/components/shared-components/status-bar-profile/StatusBarProfile";
import { useEffect, useState } from "react";
import type { Competition } from "@/types/types";
import axios from "axios";
import CompetitionCard from "@/components/home-components/competition-card/CompetitionCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const [upcoming, setUpcoming] = useState<Competition[]>([]);
  const [past, setPast] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const [upRes, pastRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/competitions/upcoming`,
          ),
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/competitions/past`,
          ),
        ]);
        console.log("Upcoming competitions:", upRes.data);
        setUpcoming(upRes.data);
        setPast(pastRes.data);
      } catch (err) {
        console.error("Error fetching competitions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  return (
    <div className={styles.page}>
      {/* Profie Bar */}
      <div className={styles.statusBar}>
        <StatusBarProfile />
      </div>

      {/* Upcoming */}
      <h1 className={styles.sectionHeading}>Upcoming Contests</h1>

      {isLoading ? (
        <div className={styles["loadingRow--mb"]}>
          <FontAwesomeIcon icon={faSpinner} spin />
          <span>Loading contests…</span>
        </div>
      ) : upcoming.length === 0 ? (
        <p className={styles.emptyUpcoming}>
          No upcoming contests at the moment
        </p>
      ) : (
        <div className={styles.cardsGrid}>
          {upcoming.map((c) => (
            <CompetitionCard
              key={c._id}
              id={c._id}
              name={c.name}
              startTime={new Date(c.startTime)}
              endTime={new Date(c.endTime)}
            />
          ))}
        </div>
      )}

      {/* Past */}
      <h1 className={styles.sectionHeading}>Past Contests</h1>

      {isLoading ? (
        <div className={styles.loadingRow}>
          <FontAwesomeIcon icon={faSpinner} spin />
          <span>Loading contests…</span>
        </div>
      ) : past.length === 0 ? (
        <p className={styles.emptyPast}>No past contests available</p>
      ) : (
        <div className={styles.cardsGrid}>
          {past.map((c) => (
            <CompetitionCard
              key={c._id}
              id={c._id}
              name={c.name}
              startTime={new Date(c.startTime)}
              endTime={new Date(c.endTime)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;

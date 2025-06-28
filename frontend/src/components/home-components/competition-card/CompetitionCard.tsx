import { Card, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faClock,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./CompetitionCard.module.css";
import { useAuth } from "@/contexts/AuthContext";

interface CompetitionCardProps {
  name: string;
  startTime: Date;
  endTime: Date;
  id: string;
}

const CompetitionCard = ({
  name,
  startTime,
  endTime,
  id,
}: CompetitionCardProps) => {
  const { firebaseUser } = useAuth();
  const navigate = useNavigate();
  const now = new Date();

  const formattedDate = format(startTime, "dd MMM yyyy");
  const formattedStart = format(startTime, "h:mm a");
  const formattedEnd = format(endTime, "h:mm a");

  const isPast = endTime < now;

  const handleEnterClick = async () => {
    try {
      if (firebaseUser?.email) {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/competitions/${id}/progress`,
          { user: firebaseUser.email },
        );
      }
    } catch (err) {
      console.error("Failed to upsert competition progress:", err);
    } finally {
      navigate(`/competition/${id}`);
    }
  };

  return (
    <Card className={styles.card}>
      <CardContent className={styles.cardContent}>
        {/* Title */}
        <h2 className={styles.title}>{name}</h2>

        {/* Date row */}
        <div className={styles.row}>
          <FontAwesomeIcon icon={faCalendarAlt} className={styles.iconDate} />
          <span className={styles.dateText}>{formattedDate}</span>
        </div>

        {/* Start time row */}
        <div className={styles.row}>
          <FontAwesomeIcon icon={faClock} />
          <span>
            <span className="font-semibold">Start:</span> {formattedStart}
          </span>
        </div>

        {/* End time row */}
        <div className={styles.row}>
          <FontAwesomeIcon icon={faClock} />
          <span>
            <span className="font-semibold">End:</span> {formattedEnd}
          </span>
        </div>

        {/* CTA */}
        <button onClick={handleEnterClick} className={styles.button}>
          {isPast ? "View Contest" : "Enter Contest"}
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </CardContent>
    </Card>
  );
};

export default CompetitionCard;

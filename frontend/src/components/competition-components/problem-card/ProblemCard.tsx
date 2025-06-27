import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./ProblemCard.module.css";

interface ProblemCardProps {
  name: string;
  points: number;
  problemId: string;
}

const ProblemCard = ({ name, points, problemId }: ProblemCardProps) => {
  const navigate = useNavigate();
  const { competitionId } = useParams();

  return (
    <Card className={styles.card}>
      <CardContent className={styles.cardContent}>
        <div className="flex flex-col flex-1">
          {/* Title */}
          <h3 className={styles.title}>{name}</h3>

          {/* Points */}
          <div className={styles.points}>
            <span className={styles.dot} />
            <span className={styles.pointsText}>{points} pts</span>
          </div>
        </div>

        {/* CTA button */}
        <Button
          className={styles.button}
          onClick={() =>
            navigate(`/competition/${competitionId}/problem/${problemId}`)
          }
        >
          To Problem
          <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProblemCard;

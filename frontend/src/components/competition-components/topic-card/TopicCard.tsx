import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./TopicCard.module.css";

interface TopicCardProps {
  name: string;
  topic: string;
}

const ProblemCard = ({ name, topic }: TopicCardProps) => {
  const navigate = useNavigate();
  const { competitionId } = useParams();

  const slugifyTopic = (raw: string) =>
    raw
      .replace(/^[^\s]+\s*/, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

  const slug = slugifyTopic(topic);

  return (
    <Card className={styles.card}>
      <CardContent className={styles.cardContent}>
        <div>
          <div className="flex flex-col flex-1">
            {/* Title */}
            <h3 className={styles.title}>{name}</h3>
          </div>

          {/* CTA button */}
          <Button
            className={styles.button}
            onClick={() =>
              navigate(`/competition/${competitionId}/topic/${slug}`, {
                state: { fullTopic: topic },
              })
            }
          >
            To Guide
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProblemCard;

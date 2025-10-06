"use client";
import { Badge } from "@/components/ui/badge";
import styles from "./ProblemDescriptionCard.module.css";
import { useProblem } from "@/contexts/ProblemContext";

export default function ProblemDescriptionCard() {
  // const { competitionId, problemId } = useParams<{
  //   competitionId: string;
  //   problemId: string;
  // }>();
  const { problemName, problemDescription } = useProblem();
  const problemPoints = 10;
  const problemTag = "Uncategorised";
  return (
    <div className={styles.card}>
      <h1 className={styles.heading}>{problemName}</h1>
      <div className="flex gap-2 mb-4">
        {problemPoints && (
          <Badge className={styles.badge}>{problemPoints} Points</Badge>
        )}
        {problemTag && <Badge className={styles.badge}>{problemTag}</Badge>}
      </div>

      <div className={styles.scrollArea}>
        <p>Hello!!!</p>
        <p>{problemDescription}</p>
      </div>
    </div>
  );
}

"use client";
import styles from "./ProblemDescriptionCard.module.css";
import { useProblem } from "@/contexts/ProblemContext";
import { useParams } from "react-router-dom";


export default function ProblemDescriptionCard() {
  const { competitionId, problemId } = useParams<{
    competitionId: string;
    problemId: string;
  }>();
  const {
    problemName,
    problemDescription,
  } = useProblem();

  return (
    <div className={styles.card}>
      <h1 className={styles.heading}>{problemName}</h1>
      {/* <div className="flex gap-2 mb-4">
        {problemPoints && (
          <Badge className={styles.badge}>{problemPoints} Points</Badge>
        )}
        {problemTag && <Badge className={styles.badge}>{problemTag}</Badge>}
      </div> */}

      <div className={styles.scrollArea}>
        <p>{problemDescription}</p>

        {/* {sampleInput && (
          <div className={styles.subCard}>
            <p>
              <strong>Sample Case</strong>
            </p>
            <ul className={styles.bulletList}>
              <li>
                <strong>Input:</strong> {sampleInput.input}
              </li>
              <li>
                <strong>Output:</strong> {sampleInput.output}
              </li>
              <li>
                <strong>Explanation:</strong> {sampleInput.explanation}
              </li>
            </ul>
          </div>
        )} */}

        {/* <div className="mb-1">
          {constraints.length > 0 && (
            <div className={styles.subCard}>
              <p>
                <strong>Constraints</strong>
              </p>
              <ul className={styles.constraintsList}>
                {constraints.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div> */}

      </div>
    </div>
  );
}

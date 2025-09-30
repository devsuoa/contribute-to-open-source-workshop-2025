import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import ProblemCard from "@/components/competition-components/problem-card/ProblemCard";
import TopicCard from "@/components/competition-components/topic-card/TopicCard";
import styles from "./CompetitionProblemSet.module.css";
import { useUser } from "@/contexts/UserContext";

export interface Problem {
  id: number;
  title: string;
  description: string;
  solution: string;
  solved:boolean;
}

const CompetitionProblemSet = () => {
  const navigate = useNavigate();
  const { competitionId } = useParams();
  const [data, setData] = useState<Record<string, Problem[]>>({});
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();

  useEffect(() => {
    if (!competitionId) return;

    (async () => {
      try {
        const base = import.meta.env.VITE_API_BASE_URL;
        const url =
          `${base}/api/competitions/${competitionId}/problems?user=${userId}`;

        const res = await axios.get(url);
        const solvedProblems = res.data.solved.map((p: Problem) => ({ ...p, solved: true }));
        const unsolvedProblems = res.data.unsolved.map((p: Problem) => ({ ...p, solved: false }));
        const allProblems = [...solvedProblems, ...unsolvedProblems];
        // Group problems by tag (currently all "Uncategorised")
        const problemRecord = allProblems.reduce((acc: Record<string, Problem[]>, problem: Problem) => {
          const tag = "Uncategorised";
          if (!acc[tag]) {
            acc[tag] = [];
          }
          acc[tag].push(problem);
          return acc;
        }, {});
        setData(problemRecord);
      } catch (err) {
        console.error("Error fetching problem set:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [competitionId, userId]);

  return (
    <div className={styles.page}>
      {/* Header Row */}
      <div className={styles.titleRow}>
        <button onClick={() => navigate("/home")} className={styles.backButton}>
          <FontAwesomeIcon icon={faHouse} className={styles.icon} />
        </button>
        <h1 className={styles.heading}>Problem Set</h1>
      </div>

      {/* Empty State */}
      {loading && (
        <div className={styles.loadingRow}>
          <FontAwesomeIcon icon={faSpinner} spin />
          <span>Loading problems…</span>
        </div>
      )}
      {!loading && Object.keys(data).length === 0 && (
        <p className={styles.emptyRow}>No problems have been released yet.</p>
      )}

      {/* Problems */}
      {Object.entries(data).map(([tag, problems]) => (
        <section key={tag} className="mb-6">
          <h2 className={styles.sectionHeading}>{tag}</h2>

          <div className={styles.cardsGrid}>
            {/* <TopicCard key={`${tag}`} name={`${tag}`} topic={tag} /> */}
            {problems.map((p) => (
              <ProblemCard
                key={p.id}
                name={p.title}
                points={10}
                problemId={p.id.toString()}
                solved={p.solved}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default CompetitionProblemSet;

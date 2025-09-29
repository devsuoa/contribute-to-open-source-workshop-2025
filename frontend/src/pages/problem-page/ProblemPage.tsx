import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Problem from "@/components/problem-components/problem/Problem";
import styles from "./ProblemPage.module.css";

interface ProblemDoc {
  _id: string;
  title: string;
  description: string;
  solution: string;
}

const ProblemPage = () => {
  const { problemId } = useParams<{ problemId: string }>();

  const [problem, setProblem] = useState<ProblemDoc | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    if (!problemId) return;

    const fetchProblem = async () => {
      try {
        const res = await axios.get<ProblemDoc>(
          `${import.meta.env.VITE_API_BASE_URL}/api/problems/${problemId}`,
        );
        setProblem(res.data);
        console.log("Fetched problem:", res.data);
      } catch (err) {
        console.error("Error fetching problem:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  if (!problem) {
    return null;
  }


  return (
    <div className={styles.container}>
      <Problem
        problemId={problem._id}
        problemName={problem.title}
        problemDescription={problem.description}
        problemSolution={problem.solution}
      />
    </div>
  );
};

export default ProblemPage;

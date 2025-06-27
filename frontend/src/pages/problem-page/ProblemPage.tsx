import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Problem from "@/components/problem-components/problem/Problem";
import styles from "./ProblemPage.module.css";

interface ProblemDoc {
  _id: string;
  name: string;
  description: string;
  sampleInput: {
    input: string;
    output: string;
    explanation: string;
  };
  constraints: string[];
  testCases: {
    inputs: string[];
    expectedOutputs: string[];
  }[];
  problemPoints: number;
  problemTag: string;
  hints: string[];
  functionSignatures: {
    cpp: {
      functionName: string;
      parameters: string[];
      returnType: string;
      toString: string;
    };
    java: {
      functionName: string;
      parameters: string[];
      returnType: string;
      toString: string;
    };
    python: {
      functionName: string;
      parameters: string[];
      returnType: string;
      toString: string;
    };
  };
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

  const { cpp } = problem.functionSignatures;
  const cppHeader = `${cpp.returnType} ${cpp.functionName}(${cpp.parameters.join(
    ", ",
  )}) {`;

  return (
    <div className={styles.container}>
      <Problem
        problemId={problem._id}
        problemName={problem.name}
        problemDescription={problem.description}
        problemFunctionHeader={cppHeader}
        sampleInput={problem.sampleInput}
        constraints={problem.constraints}
        testCases={problem.testCases.map(({ inputs, expectedOutputs }) => ({
          inputs,
          expected: expectedOutputs[0] ?? "",
        }))}
        problemPoints={problem.problemPoints}
        problemTag={problem.problemTag}
        problemHints={problem.hints}
        functionSignatures={problem.functionSignatures}
      />
    </div>
  );
};

export default ProblemPage;

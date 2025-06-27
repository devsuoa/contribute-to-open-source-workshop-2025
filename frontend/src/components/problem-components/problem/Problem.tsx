import ProblemEditor from "../problem-editor/ProblemEditor";
import { ProblemTabs } from "../problem-tabs/ProblemTabs";
import styles from "./Problem.module.css";
import type { ProblemProps } from "@/types/types";
import { ProblemProvider } from "@/contexts/ProblemContext";

const Problem = ({
  problemId,
  problemName,
  problemDescription,
  problemFunctionHeader,
  sampleInput,
  constraints,
  testCases,
  problemPoints,
  problemTag,
  problemHints,
  functionSignatures,
}: ProblemProps) => {
  return (
    <ProblemProvider
      problemId={problemId}
      problemName={problemName}
      problemDescription={problemDescription}
      problemFunctionHeader={problemFunctionHeader}
      sampleInput={sampleInput}
      constraints={constraints}
      testCases={testCases}
      problemPoints={problemPoints}
      problemTag={problemTag}
      problemHints={problemHints}
      functionSignatures={functionSignatures}
    >
      <div className={styles.wrapper}>
        <div className={styles.contentRow}>
          <div className={styles.leftPane}>
            <ProblemTabs />
          </div>
          <div className={styles.rightPane}>
            <ProblemEditor />
          </div>
        </div>
      </div>
    </ProblemProvider>
  );
};

export default Problem;

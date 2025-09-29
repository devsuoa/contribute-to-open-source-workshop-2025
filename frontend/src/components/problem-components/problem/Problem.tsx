import ProblemEditor from "../problem-editor/ProblemEditor";
import { ProblemTabs } from "../problem-tabs/ProblemTabs";
import styles from "./Problem.module.css";
import type { ProblemProps } from "@/types/types";
import { ProblemProvider } from "@/contexts/ProblemContext";

const Problem = ({
  problemId,
  problemName,
  problemDescription,
  problemSolution,
}: ProblemProps) => {
  return (
    <ProblemProvider
      problemId={problemId}
      problemName={problemName}
      problemDescription={problemDescription}
      problemSolution={problemSolution}
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

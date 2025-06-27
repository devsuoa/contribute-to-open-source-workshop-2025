import { useEffect, useRef, useState } from "react";
import { useProblem } from "@/contexts/ProblemContext";
import styles from "./ProblemTestsCard.module.css";
import { SyncLoader } from "react-spinners";

export default function ProblemTestsCard() {
  const { testResults, isLoadingTestResults } = useProblem();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const wasLoadingRef = useRef(false);

  useEffect(() => {
    if (
      wasLoadingRef.current &&
      !isLoadingTestResults &&
      testResults.length > 0
    ) {
      setShouldAnimate(true);
      const totalDuration = 300 + testResults.length * 100;
      const timer = setTimeout(() => setShouldAnimate(false), totalDuration);
      return () => clearTimeout(timer);
    }
    wasLoadingRef.current = isLoadingTestResults;
  }, [isLoadingTestResults, testResults]);

  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>Tests</h2>
      <div className={styles.scrollArea}>
        {isLoadingTestResults ? (
          <div className={styles.spinnerWrapper}>
            <SyncLoader size={15} color="#2F2F2F" />
          </div>
        ) : testResults.length === 0 ? (
          <div className={styles.emptyWrapper}>
            <p>No tests have been run</p>
          </div>
        ) : (
          testResults.map((result, idx) => {
            const { inputs, output, expected, status, pass } = result;
            return (
              <div
                key={idx}
                className={[
                  styles.testResult,
                  pass ? styles.pass : styles.fail,
                  shouldAnimate ? styles.fadeIn : "",
                ].join(" ")}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <p>
                  <strong>Input:</strong>{" "}
                  {inputs
                    .map((val) =>
                      Array.isArray(val) ? `[${val.join(",")}]` : String(val),
                    )
                    .join(", ")}
                </p>
                <p>
                  <strong>Expected:</strong> {String(expected)}
                </p>
                <p>
                  <strong>Output:</strong>{" "}
                  {output === null ? "null" : String(output)}
                </p>
                {!pass && status && (
                  <p className={styles.error}>
                    <strong>Error:</strong> {status}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

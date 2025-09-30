import styles from "./CodeEditorControls.module.css";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useProblem } from "@/contexts/ProblemContext";
import type { TestResult } from "@/types/types";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const CodeEditorControls = () => {
  const { competitionId, problemId } = useParams<{
    competitionId: string;
    problemId: string;
  }>();
  const { userId } = useUser();

  const { setTestResults, code, setCode, setActiveTab } = useProblem();

  const showSuccessToast = () => {
    toast.success("🎉 All tests passed! Beautiful work! 🌟", {
      description: "Your code sparkles with perfection ✨",
      duration: 4000,
    });
  };

  const showFailureToast = (passedCount: number, totalCount: number) => {
    const failedCount = totalCount - passedCount;
    const encouragement = [
      "Keep coding, you're getting closer! 💪",
      "Every bug is a step toward mastery! 🐛➡️🦋",
      "Debugging is like solving a puzzle! 🧩",
      "Great coders debug with style! 🕶️",
      "This is where the magic happens! ✨",
    ];

    const randomEncouragement =
      encouragement[Math.floor(Math.random() * encouragement.length)];

    toast.error(
      `❌ ${failedCount} test${failedCount > 1 ? "s" : ""} failed (${passedCount}/${totalCount} passed)`,
      {
        description: randomEncouragement,
        duration: 5000,
      },
    );
  };

  const handleSubmit = async () => {
    console.log("🚀 Submitting code with test cases...");

    const markSolved = async () => {
      if (!competitionId || !problemId) return;

      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/competitions/${competitionId}/progress/${userId}/solve`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            problemId: problemId,
            addPoints: 10,
          }),
        },
      );
    };

    const createSubmission = async (verdict: string) => {
      if (!competitionId || !problemId) return;
      console.log("Creating submission with:", competitionId, problemId, userId, code, verdict);
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competition: competitionId,
          problem: problemId,
          user: userId,
          content: code,
          verdict,
        }),
      });
    };

    const fetchProblemSolution = async () => {
      if (!problemId) return null;
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/problems/${problemId}`,
      );
      const data = await response.json();
      return data.solution;
    };

    setActiveTab("tests");
    const newResults: TestResult[] = [];

    const problemSolution = await fetchProblemSolution();
    if (!problemSolution) {
      toast.error("❌ Unable to fetch problem solution.");
      return;
    }
    const answer = code.trim();
    newResults.push({
      inputs: [answer],
      expected: problemSolution,
      pass: answer === problemSolution,
    });

    setTestResults(newResults);

    const passedTests = newResults.filter((result) => result.pass).length;
    const totalTests = newResults.length;

    if (passedTests === totalTests && totalTests > 0) {
      await markSolved();
      await createSubmission("Accepted");
      window.dispatchEvent(new CustomEvent("points:add", { detail: 10 }));
      showSuccessToast();
    } else {
      await createSubmission("Rejected");
      showFailureToast(passedTests, totalTests);
    }
  };

  const handleReset = () => {
    setCode("");
  };

  return (
    <>
      <div className={styles.buttonRow}>
        <div className={styles.leftButtons}>
          <Button
            variant="outline"
            className={styles.iconButton}
            onClick={handleReset}
          >
            <FontAwesomeIcon icon={faRotateLeft} className={styles.iconReset} />
            Reset
          </Button>
        </div>
        <div className={styles.rightButtons}>
          <Button
            variant="outline"
            className={styles.iconButton}
            onClick={handleSubmit}
          >
            <FontAwesomeIcon
              icon={faPaperPlane}
              className={styles.iconSubmit}
            />
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default CodeEditorControls;

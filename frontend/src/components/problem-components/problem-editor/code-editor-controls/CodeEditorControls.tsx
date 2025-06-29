import styles from "./CodeEditorControls.module.css";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faRotateLeft,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { useProblem } from "@/contexts/ProblemContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Language } from "@/types/types";
import { FunctionBuilder } from "@/utility/FunctionBuilder";
import type { TestResult } from "@/types/types";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const CodeEditorControls = () => {
  const { firebaseUser } = useAuth();
  const { competitionId, problemId } = useParams<{
    competitionId: string;
    problemId: string;
  }>();
  const { problemPoints } = useProblem();

  const {
    testCases,
    setTestResults,
    setActiveTab,
    setIsLoadingTestResults,
    preferredLanguage,
    setPreferredLanguage,
    code,
    setCode,
    functionSignatures,
    runArgs,
    setConsoleOutput,
    setConsoleStdout,
    setConsoleStderr,
    setConsoleLoading,
  } = useProblem();

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
    setIsLoadingTestResults(true);
    console.log("🚀 Submitting code with test cases...");

    // Make sure we have a signature for the selected language
    const signature = functionSignatures[preferredLanguage];
    if (!signature) {
      console.error(
        `❌ No function signature found for language: ${preferredLanguage}`,
      );
      setIsLoadingTestResults(false);
      return;
    }

    const markSolved = async () => {
      if (!competitionId || !problemId || !firebaseUser?.email) return;

      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/competitions/${competitionId}/progress/${firebaseUser.email}/solve`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            problem: problemId,
            addPoints: problemPoints ?? 0,
          }),
        },
      );
    };

    const createSubmission = async (verdict: string) => {
      if (!competitionId || !problemId || !firebaseUser?.email) return;
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competition: competitionId,
          problem: problemId,
          user: firebaseUser.email,
          language: preferredLanguage,
          sourceCode: code,
          verdict,
        }),
      });
    };

    // Split the current editor contents into lines for piston
    const functionLines = code
      .trim()
      .split(/\r?\n/)
      .map((ln) => ln.replace(/\r$/, ""));

    setActiveTab("tests");
    const newResults: TestResult[] = [];

    for (const testCase of testCases) {
      const payload = {
        functionLines,
        functionName: signature.functionName,
        inputs: testCase.inputs,
        expected: testCase.expected,
        toStringSnippet: signature.toString,
      };

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/piston/execute-${preferredLanguage}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
        const result = await res.json();

        console.log("🧪 Test Case:", payload.inputs);
        console.log("✅ Result:", result);

        newResults.push({
          inputs: payload.inputs,
          expected: payload.expected,
          output: result.output,
          status: result.status,
          pass: result.pass,
        });
      } catch (err) {
        console.error("❌ Error executing test case:", err);
        newResults.push({
          inputs: testCase.inputs,
          expected: testCase.expected,
          output: null,
          status: "ERROR",
          pass: false,
        });
      }
    }

    setTestResults(newResults);
    setIsLoadingTestResults(false);

    const passedTests = newResults.filter((result) => result.pass).length;
    const totalTests = newResults.length;

    if (passedTests === totalTests && totalTests > 0) {
      await markSolved();
      await createSubmission("ACCEPTED");
      window.dispatchEvent(
        new CustomEvent("points:add", { detail: problemPoints ?? 0 }),
      );
      showSuccessToast();
    } else {
      await createSubmission("WRONG ANSWER");
      showFailureToast(passedTests, totalTests);
    }
  };

  const handleReset = () => {
    const snippet = FunctionBuilder(preferredLanguage, functionSignatures);
    setCode(snippet);
  };

  const handleRun = async () => {
    setActiveTab("console");

    setConsoleLoading(true);

    console.log("▶️  Running with args:", runArgs);

    const sig = functionSignatures[preferredLanguage];
    if (!sig) return;

    const functionLines = code
      .trim()
      .split(/\r?\n/)
      .map((ln) => ln.replace(/\r$/, ""));

    const payload = {
      functionLines,
      functionName: sig.functionName,
      inputs: runArgs,
      toStringSnippet: sig.toString,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/piston/run-${preferredLanguage}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = await res.json();
      console.log("🔙 run result:", result);
      setConsoleOutput(result.output ?? "");
      setConsoleStdout(result.stdout ?? "");
      setConsoleStderr(result.stderr ?? "");

      setConsoleLoading(false);
    } catch (err) {
      console.error("❌ run error:", err);
      setConsoleLoading(false);
    }
  };

  return (
    <>
      <div className={styles.buttonRow}>
        <div className={styles.leftButtons}>
          <Select
            value={preferredLanguage}
            onValueChange={(value) => setPreferredLanguage(value as Language)}
          >
            <SelectTrigger className="w-[100px] cursor-pointer focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ borderColor: "#2F2F2F" }}>
              <SelectItem
                value="cpp"
                className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
              >
                C++
              </SelectItem>
              <SelectItem
                value="java"
                className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
              >
                Java
              </SelectItem>
              <SelectItem
                value="python"
                className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
              >
                Python
              </SelectItem>
            </SelectContent>
          </Select>

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
            onClick={handleRun}
          >
            <FontAwesomeIcon icon={faPlay} className={styles.iconInfo} />
            Run
          </Button>
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

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

const CodeEditorControls = () => {
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
  } = useProblem();

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
  };

  const handleReset = () => {
    const snippet = FunctionBuilder(preferredLanguage, functionSignatures);
    setCode(snippet);
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
            onClick={handleSubmit}
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

import { createContext, useContext, useState, useEffect } from "react";

import type { ReactNode } from "react";
import type {
  ProblemContextType,
  TestResult,
  Language,
  ProblemProps,
} from "@/types/types";

type ProblemProviderProps = ProblemProps & { children: ReactNode };
const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

export const ProblemProvider = ({
  children,
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
}: ProblemProviderProps) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState("problem");
  const [isLoadingTestResults, setIsLoadingTestResults] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState<Language>("cpp");
  const [code, setCode] = useState("");

  const stringify = (x: string | number | (string | number)[]) =>
    Array.isArray(x) ? JSON.stringify(x) : String(x);
  const initialArgs =
    testCases.length > 0 ? testCases[0].inputs.map(stringify) : [];

  const [runArgs, setRunArgs] = useState<string[]>(initialArgs);
  const [consoleOutput, setConsoleOutput] = useState("");
  const [consoleStdout, setConsoleStdout] = useState("");
  const [consoleStderr, setConsoleStderr] = useState("");
  const [consoleLoading, setConsoleLoading] = useState(false);

  useEffect(() => {
    console.log("❓ Problem: ", problemName);
    console.log("📜 Description:", problemDescription);

    console.log("⌛ Test Cases:", testCases);
    console.log("📝 Function Signatures:", functionSignatures);
    console.log("💡 Hints:", problemHints);
    console.log("🏷️ Problem Points:", problemPoints);
    console.log("🏷️ Problem Tag:", problemTag);
    console.log("🔧 Preferred Language:", preferredLanguage);
  }, [
    problemName,
    problemDescription,
    testCases,
    functionSignatures,
    problemHints,
    problemPoints,
    problemTag,
    preferredLanguage,
  ]);

  return (
    <ProblemContext.Provider
      value={{
        problemId,
        problemName,
        problemDescription,
        problemFunctionHeader,
        sampleInput,
        constraints,
        testCases,
        testResults,
        setTestResults,
        problemPoints,
        problemTag,
        problemHints,
        functionSignatures,
        activeTab,
        setActiveTab,
        isLoadingTestResults,
        setIsLoadingTestResults,
        preferredLanguage,
        setPreferredLanguage,
        code,
        setCode,
        runArgs,
        setRunArgs,
        consoleOutput,
        setConsoleOutput,
        consoleStdout,
        setConsoleStdout,
        consoleStderr,
        setConsoleStderr,
        consoleLoading,
        setConsoleLoading,
      }}
    >
      {children}
    </ProblemContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProblem = () => {
  const context = useContext(ProblemContext);
  if (!context) {
    throw new Error("useProblem must be used within a ProblemProvider");
  }
  return context;
};

import { createContext, useContext, useState, useEffect } from "react";

import type { ReactNode } from "react";
import type {
  ProblemContextType,
  ProblemProps,
  TestResult,
} from "@/types/types";

type ProblemProviderProps = ProblemProps & { children: ReactNode };
const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

export const ProblemProvider = ({
  children,
  problemId,
  problemName,
  problemDescription,
  problemSolution,
}: ProblemProviderProps) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [code, setCode] = useState("");

  const [activeTab, setActiveTab] = useState("problem");

  const [consoleOutput, setConsoleOutput] = useState("");
  const [consoleLoading, setConsoleLoading] = useState(false);

  useEffect(() => {
    console.log("❓ Problem: ", problemName);
    console.log("📜 Description:", problemDescription);

    console.log("⌛ Solution:", problemSolution);
  }, [problemName, problemDescription, problemSolution]);

  return (
    <ProblemContext.Provider
      value={{
        problemId,
        problemName,
        problemDescription,
        problemSolution,
        activeTab,
        setActiveTab,
        code,
        setCode,
        testResults,
        setTestResults,
        consoleOutput,
        setConsoleOutput,
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

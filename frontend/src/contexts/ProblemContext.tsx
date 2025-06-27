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

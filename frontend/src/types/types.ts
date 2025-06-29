export interface TestCase {
  inputs: (string | number | Array<string | number>)[];
  expected: string | number;
}

export interface TestResult {
  inputs: (string | number | Array<string | number>)[];
  expected: string | number;
  output: string | number | null;
  status: string;
  pass: boolean;
}

export const YEAR_LEVELS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "5+",
  "Postgraduate",
] as const;

export const LANGUAGES = ["cpp", "python", "java"] as const;

export type YearLevel = (typeof YEAR_LEVELS)[number];
export type Language = (typeof LANGUAGES)[number];

export type FunctionSignature = {
  functionName: string;
  parameters: string[];
  returnType: string;
  toString: string;
};

export type FunctionSignatures = Partial<Record<Language, FunctionSignature>>;

export interface ProblemProps {
  problemId: string;
  problemName: string;
  problemDescription: string;
  problemFunctionHeader: string;

  sampleInput: {
    input: string;
    output: string;
    explanation: string;
  };

  constraints: string[];
  testCases: TestCase[];

  problemPoints: number;
  problemTag: string;
  problemHints: string[];

  functionSignatures: FunctionSignatures;
}

export interface ProblemContextType {
  problemId: string;
  problemName: string;
  problemDescription: string;
  problemFunctionHeader: string;

  sampleInput: {
    input: string;
    output: string;
    explanation: string;
  };

  constraints: string[];
  testCases: TestCase[];

  testResults: TestResult[];
  setTestResults: React.Dispatch<React.SetStateAction<TestResult[]>>;

  isLoadingTestResults: boolean;
  setIsLoadingTestResults: React.Dispatch<React.SetStateAction<boolean>>;

  problemPoints: number;
  problemTag: string;
  problemHints: string[];
  functionSignatures: FunctionSignatures;

  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;

  preferredLanguage: Language;
  setPreferredLanguage: React.Dispatch<React.SetStateAction<Language>>;

  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;

  runArgs: string[];
  setRunArgs: React.Dispatch<React.SetStateAction<string[]>>;

  consoleOutput: string;
  setConsoleOutput: React.Dispatch<React.SetStateAction<string>>;
  consoleStdout: string;
  setConsoleStdout: React.Dispatch<React.SetStateAction<string>>;
  consoleStderr: string;
  setConsoleStderr: React.Dispatch<React.SetStateAction<string>>;

  consoleLoading: boolean;
  setConsoleLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface User {
  email: string;
  nick: string;
  yearLevel: YearLevel;
  preferredLanguage: Language;
}

export interface Competition {
  _id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  problems: string[];
  leaderboard: {
    user: string;
    points: number;
  }[];
}

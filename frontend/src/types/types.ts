export interface TestCase {
  inputs: (string | number | Array<string | number>)[];
  expected: string | number;
}

export interface TestResult {
  inputs: (string | number | Array<string | number>)[];
  expected: string | number;
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
  problemSolution: string;
}

export interface ProblemContextType {
  problemId: string;
  problemName: string;
  problemDescription: string;
  problemSolution: string;

  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;

  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;

  testResults: TestResult[];
  setTestResults: React.Dispatch<React.SetStateAction<TestResult[]>>;

  consoleOutput: string;
  setConsoleOutput: React.Dispatch<React.SetStateAction<string>>;

  consoleLoading: boolean;
  setConsoleLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UserContextType {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  userToken: string;
  setUserToken: React.Dispatch<React.SetStateAction<string>>;
  saveToLocalStorage: (userId: string, token: string) => void;
  isLoggedIn: boolean | null;
}

export interface User {
  email: string;
  nick: string;
  yearLevel: YearLevel;
  preferredLanguage: Language;
}

export interface Competition {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  problems: string[];
}

/* init-db.ts ------------------------------------------------------------- */
import mongoose from "mongoose";
import Problem from "./problem-schema.js";
import Competition from "./competition-schema.js";
import TagOrder from "./tag-order-schema.js";
import "dotenv/config";

const { MONGODB_CONNECTION_STRING } = process.env;
if (!MONGODB_CONNECTION_STRING)
  throw new Error("❌ MONGODB_CONNECTION_STRING not set");

await mongoose.connect(MONGODB_CONNECTION_STRING);
console.log("✅ Connected to MongoDB");

await Promise.all([Problem.deleteMany({}), Competition.deleteMany({})]);
console.log("🧹 Cleared old Problem & Competition documents");

const problems = await Problem.insertMany([
  {
    name: "Remove Duplicates",
    description:
      "Return a new array with duplicates removed while keeping first occurrences.",
    problemPoints: 60,
    problemTag: "Implementation",
    hints: ["Use a set to remember seen values."],
    functionSignatures: {
      cpp: {
        functionName: "removeDuplicates",
        parameters: ["const vector<int>& arr"],
        returnType: "vector<int>",
        toString: `string toString(const vector<int>& v) {\n  string out = "[";\n  for (size_t i = 0; i < v.size(); ++i) {\n    out += to_string(v[i]);\n    if (i + 1 < v.size()) out += ", ";\n  }\n  out += "]";\n  return out;\n}`,
      },
      java: {
        functionName: "removeDuplicates",
        parameters: ["int[] arr"],
        returnType: "int[]",
        toString: `import java.util.Arrays;\npublic static String toString(int[] arr) {\n  return Arrays.toString(arr).replace(" ", "");\n}`,
      },
      python: {
        functionName: "remove_duplicates",
        parameters: ["arr: list[int]"],
        returnType: "list[int]",
        toString: `def to_string(arr: list[int]) -> str:\n    return str(arr)`,
      },
    },
    sampleInput: {
      input: "{1, 2, 2, 3}",
      output: "[1, 2, 3]",
      explanation: "The second 2 is skipped.",
    },
    constraints: ["1 ≤ n ≤ 100000", "−10⁹ ≤ arr[i] ≤ 10⁹"],
    testCases: [
      { inputs: ["{1, 2, 2, 3}"], expectedOutputs: ['"[1, 2, 3]"'] },
      { inputs: ["{4, 4, 4, 4}"], expectedOutputs: ['"[4]"'] },
      { inputs: ["{}"], expectedOutputs: ['"[]"'] },
    ],
  },

  {
    name: "String Compression",
    description: 'Compress repeating characters, e.g. "aabccc" → "a2bc3".',
    problemPoints: 70,
    problemTag: "Implementation",
    hints: ["Track run lengths; append counts only if >1."],
    functionSignatures: {
      cpp: {
        functionName: "compressString",
        parameters: ["const string& s"],
        returnType: "string",
        toString: `string toString(const string& s) { return s; }`,
      },
      java: {
        functionName: "compressString",
        parameters: ["String s"],
        returnType: "String",
        toString: `public static String toString(String s) { return s; }`,
      },
      python: {
        functionName: "compress_string",
        parameters: ["s: str"],
        returnType: "str",
        toString: `def to_string(s: str) -> str:\n    return s`,
      },
    },
    sampleInput: {
      input: '"aabccc"',
      output: '"a2bc3"',
      explanation: "Two a's → a2; three c's → c3.",
    },
    constraints: ["1 ≤ |s| ≤ 100000"],
    testCases: [
      { inputs: ['"aabccc"'], expectedOutputs: ['"a2bc3"'] },
      { inputs: ['"abcd"'], expectedOutputs: ['"abcd"'] },
      { inputs: ['"aaaaa"'], expectedOutputs: ['"a5"'] },
    ],
  },
]);
console.log(`🧠 Inserted ${problems.length} problems`);

const pastYears = [2018, 2019, 2020, 2021, 2022];
const past = pastYears.map((y) => ({
  name: `Archived Contest ${y}`,
  startTime: new Date(`${y}-01-01T10:00:00Z`),
  endTime: new Date(`${y}-01-01T12:00:00Z`),
  problems: problems.map((p) => p._id),
}));

const future = [2026, 2027, 2028].map((year) => ({
  name: `Future Contest ${year}`,
  startTime: new Date(`${year}-05-01T14:00:00Z`),
  endTime: new Date(`${year}-05-01T16:00:00Z`),
  problems: problems.map((p) => p._id),
}));

await Competition.insertMany([...past, ...future]);
console.log(`🏁 Inserted competitions: ${past.length + future.length}`);

await TagOrder.updateOne(
  { scope: "global" },
  {
    $setOnInsert: {
      order: [
        "Implementation",
        "Math",
        "Greedy",
        "Binary Search",
        "Two Pointers",
        "Sliding Window",
        "Prefix Sum",
        "Stacks",
        "Queues",
        "Trees",
        "Heaps",
        "Linked Lists",
        "DFS",
        "BFS",
        "Graph Theory",
        "Single Source Shortest Path",
        "Minimum Spanning Tree",
        "Backtracking",
        "1D Dynamic Programming",
        "2D Dynamic Programming",
      ],
    },
  },
  { upsert: true },
);
console.log("✅ Tag order initialised");

/* ---------- done ---------- */
await mongoose.disconnect();
console.log("🔌 Disconnected — seed complete");

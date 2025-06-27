import express, { Request, Response } from "express";

const router = express.Router();

/*
 * POST /api/piston/execute-cpp
 * Executes a C++ function using the Piston API.
 * Expects a JSON body with the function lines, function name, inputs, expected output, and a toString helper.
 */
router.post("/execute-cpp", async (req: Request, res: Response) => {
  const {
    functionLines,
    functionName,
    inputs,
    expected,
    toStringSnippet,
  }: {
    functionLines: string[];
    functionName: string;
    inputs: string[];
    expected: string;
    toStringSnippet: string;
  } = req.body;

  const source = `#include <bits/stdc++.h>
using namespace std;

${functionLines.join("\n")}

// caller-supplied toString helper
${toStringSnippet}

int main() {
  auto result = ${functionName}(${inputs.join(", ")});
  string resultStr   = toString(result);
  string expectedStr = ${expected};
  if (resultStr == expectedStr) {
    cout << "__TEST__=PASS\\n";
  } else {
    cout << "__TEST__=FAIL: got " << resultStr
         << ", expected " << expectedStr << "\\n";
  }
  return 0;
}
`;
  // Log the submission details
  console.log("=".repeat(70));
  console.log("🚀 Submitting C++ code to Piston");
  console.log("-".repeat(70));
  console.log("🧠 Function Name:", functionName);
  console.log("📤 Inputs       :", JSON.stringify(inputs));
  console.log("🎯 Expected     :", expected);
  console.log("-".repeat(70));
  console.log("🧱 Generated C++17 Source:\n");
  source
    .split("\n")
    .forEach((ln, i) => console.log(`${String(i + 1).padStart(3)} | ${ln}`));
  console.log("=".repeat(70));

  try {
    const pistonUrl = process.env.PISTON_URL;
    if (!pistonUrl) throw new Error("PISTON_URL env var not set");

    const pistonResp = await fetch(pistonUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "g++",
        version: "10.2.0",
        files: [{ name: "main.cpp", content: source }],
        run_timeout: 2000,
        compile_timeout: 5000,
        run_memory_limit: 128_000_000,
        compile_memory_limit: 512_000_000,
      }),
    });

    const data = await pistonResp.json();

    // Check for errors in the Piston response
    if (data.compile?.code !== undefined) {
      if (data.compile.code !== 0) {
        console.warn("❌ Compilation failed:\n", data.compile.stderr ?? "");
      } else {
        console.log("📦 Compilation OK");
      }
    } else {
      console.warn("⚠️ No compile object in Piston response");
    }

    if (data.run?.status) {
      if (data.run.status === "TO") {
        console.warn("⏱️  Execution timed out.");
      }
      if (data.run.stdout) {
        console.log("📥 Stdout:\n", data.run.stdout.trim());
      }
      if (data.run.stderr) {
        console.log("⚠️  Stderr:\n", data.run.stderr.trim());
      }
    } else {
      console.warn("⚠️ No run object in Piston response");
    }

    // Determine final status based on compile and run results
    let status = "RUNTIME ERROR";
    let pass = false;
    let output: string | null = null;

    if (data.compile?.code !== 0) {
      status = "COMPILE ERROR";
    } else if (data.run?.status === "TO") {
      status = "TLE";
    } else {
      const line = (data.run?.stdout ?? "").match(/__TEST__=(.*)/)?.[1]?.trim();
      if (line?.startsWith("PASS")) {
        status = "CORRECT";
        pass = true;
        output = expected;
      } else if (line?.startsWith("FAIL")) {
        status = "WRONG";
        output = line.match(/got\\s+(.*),\\s+expected/)?.[1] ?? null;
      }
    }

    console.log("✅ Final Status:", status);
    console.log("=".repeat(70));

    res.json({ success: true, pass, expected, output, status });
  } catch (err) {
    console.error("🔥 execute-cpp fatal error:", err);
    res.status(500).json({
      success: false,
      pass: false,
      expected,
      output: null,
      status: "RUNTIME ERROR",
    });
  }
});

export default router;

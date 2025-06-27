/*  src/components/MonacoEditor.tsx  */
import { useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { useProblem } from "@/contexts/ProblemContext";
import { FunctionBuilder } from "@/utility/FunctionBuilder"; // camel-case “f”

const MonacoEditor = () => {
  const { preferredLanguage, functionSignatures, code, setCode } = useProblem();

  /* Seed the editor only when it's empty */
  useEffect(() => {
    const snippet = FunctionBuilder(preferredLanguage, functionSignatures);
    setCode(snippet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferredLanguage]);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        border: "1px solid #2F2F2F",
        overflow: "hidden",
      }}
    >
      <Editor
        language={preferredLanguage}
        value={code}
        onChange={(v) => setCode(v ?? "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbersMinChars: 3,
          lineDecorationsWidth: 1,
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  );
};

export default MonacoEditor;

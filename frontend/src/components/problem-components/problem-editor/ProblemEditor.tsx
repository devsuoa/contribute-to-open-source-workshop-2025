import styles from "./ProblemEditor.module.css";
import CodeEditorControls from "./code-editor-controls/CodeEditorControls";
import MonacoEditor from "./monaco-editor/MonacoEditor";

const ProblemEditor = () => {
  return (
    <div className={styles.wrapper}>
      <CodeEditorControls />

      <div className={styles.card}>
        <div className={styles.scrollArea}></div>
        <MonacoEditor />
      </div>
    </div>
  );
};

export default ProblemEditor;

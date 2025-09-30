import { useRef } from "react";

import type React from "react";

import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useProblem } from "@/contexts/ProblemContext";
import styles from "./ProblemConsoleCard.module.css";
import { BarLoader } from "react-spinners";

export default function ProblemConsoleCard() {
  const {
    consoleOutput,
    consoleLoading,
  } = useProblem();

  // const handleChange = (idx: number, v: string) =>
  //   setRunArgs((p) => Object.assign([...p], { [idx]: v }));

  const textareaClass =
    "w-full font-mono !text-sm !font-medium bg-[#1F1F1F] border border-[#2F2F2F] rounded-md " +
    "px-3 py-3 focus-visible:ring-0 resize-none min-h-[40px] hide-scrollbar overflow-hidden";

  return (
    <div className={styles.card}>
      <div className="flex items-center justify-between">
        <h2 className={styles.heading}>Console</h2>
        {consoleLoading && (
          <div className="overflow-hidden rounded-md flex items-center mb-2">
            <BarLoader
              height={8}
              width={100}
              color="#FFFFFF"
              speedMultiplier={1.2}
            />
          </div>
        )}
      </div>

      <div className={styles.scrollArea}>
        {(
          <>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              {/* {sig.parameters.map((p, i) => (
                <div key={p} className="space-y-1">
                  <label className="block text-sm font-medium text-muted-foreground">
                    {p}
                  </label>
                  <AutoResizeTextarea
                    value={""}
                    onChange={(e) => handleChange(i, e.target.value)}
                    placeholder={`Enter ${p}`}
                    className={textareaClass}
                  />
                </div>
              ))} */}
            </form>

            <div className="mt-4 space-y-3">
              <Field
                title="Output"
                value={consoleOutput}
                accent="text-[#00D492]"
                textareaClass={textareaClass}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// function AutoResizeTextarea({
//   value,
//   onChange,
//   placeholder,
//   className,
// }: {
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
//   placeholder: string;
//   className: string;
// }) {
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   useEffect(() => {
//     const textarea = textareaRef.current;
//     if (textarea) {
//       // Reset height to auto to get the correct scrollHeight
//       textarea.style.height = "auto";
//       // Set height to scrollHeight to fit content
//       textarea.style.height = `${Math.max(40, textarea.scrollHeight)}px`;
//     }
//   }, [value]);

//   return (
//     <Textarea
//       ref={textareaRef}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       className={className}
//       rows={1}
//     />
//   );
// }

function Field({
  title,
  value,
  accent,
  textareaClass,
}: {
  title: string;
  value: string;
  accent: string;
  textareaClass: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.max(40, textarea.scrollHeight)}px`;
    }
  }, [value]);

  return (
    <div className="space-y-1">
      <label className={`block text-sm font-medium ${accent}`}>{title}</label>
      <Textarea
        ref={textareaRef}
        value={value}
        readOnly
        className={`${textareaClass} cursor-default`}
        placeholder={value ? undefined : "No output"}
        rows={1}
      />
    </div>
  );
}

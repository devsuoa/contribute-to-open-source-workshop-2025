import styles from "./ProblemDescriptionCard.module.css";
import { useProblem } from "@/contexts/ProblemContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function ProblemDescriptionCard() {
  const {
    problemName,
    problemDescription,
    sampleInput,
    constraints,
    problemHints,
    problemPoints,
    problemTag,
  } = useProblem();

  return (
    <div className={styles.card}>
      <h1 className={styles.heading}>{problemName}</h1>

      <div className="flex gap-2 mb-4">
        {problemPoints && (
          <Badge className={styles.badge}>{problemPoints} Points</Badge>
        )}
        {problemTag && <Badge className={styles.badge}>{problemTag}</Badge>}
      </div>

      <div className={styles.scrollArea}>
        <p>{problemDescription}</p>

        {sampleInput && (
          <div className={styles.subCard}>
            <p>
              <strong>Sample Case</strong>
            </p>
            <ul className={styles.bulletList}>
              <li>
                <strong>Input:</strong> {sampleInput.input}
              </li>
              <li>
                <strong>Output:</strong> {sampleInput.output}
              </li>
              <li>
                <strong>Explanation:</strong> {sampleInput.explanation}
              </li>
            </ul>
          </div>
        )}
        <div className="mb-1">
          {constraints.length > 0 && (
            <div className={styles.subCard}>
              <p>
                <strong>Constraints</strong>
              </p>
              <ul className={styles.constraintsList}>
                {constraints.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {problemHints && problemHints.length > 0 && (
          <Accordion type="multiple">
            {problemHints.map((hint, idx) => {
              const id = `hint-${idx + 1}`;
              return (
                <AccordionItem
                  key={id}
                  value={id}
                  className="border-b border-[#2F2F2F] last:border-b-0"
                >
                  <AccordionTrigger className="flex justify-between items-center gap-2 cursor-pointer hover:no-underline py-4 [&[data-state=open]>svg]:rotate-0">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faLightbulb}
                        className="text-yellow-400"
                      />
                      <span>Hint&nbsp;{idx + 1}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">{hint}</AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </div>
  );
}

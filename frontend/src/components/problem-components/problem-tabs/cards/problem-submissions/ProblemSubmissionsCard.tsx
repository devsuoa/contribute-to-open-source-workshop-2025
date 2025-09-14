import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCode,
  faCheckCircle,
  faTimesCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./ProblemSubmissionsCard.module.css";

interface Submission {
  _id: string;
  language: string;
  verdict: string;
  sourceCode: string;
  submittedAt: string;
}

const verdictIcon = (v: string) =>
  v.toLowerCase() === "accepted" ? (
    <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 text-[#00D492]" />
  ) : v.toLowerCase() === "wrong answer" ? (
    <FontAwesomeIcon icon={faTimesCircle} className="h-4 w-4 text-[#F87171]" />
  ) : (
    <FontAwesomeIcon
      icon={faExclamationCircle}
      className="h-4 w-4 text-gray-500"
    />
  );

const verdictColor = (v: string) =>
  v.toLowerCase() === "accepted"
    ? "text-[#00D492]"
    : v.toLowerCase() === "wrong answer"
      ? "text-[#F87171]"
      : "text-gray-500";

export default function ProblemSubmissionsCard() {
  const { competitionId, problemId } = useParams<{
    competitionId: string;
    problemId: string;
  }>();

  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!competitionId) return;
    (async () => {
      try {
        const { data } = await axios.get<Submission[]>(
          `${import.meta.env.VITE_API_BASE_URL}/api/submissions/${competitionId}/${problemId}/<USER_EMAIL>`,
        );
        setSubs(data);
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [competitionId]);

  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>Submissions</h2>

      <div className={styles.scrollArea}>
        {loading && <p className={styles.emptyWrapper}>Loading…</p>}

        {!loading && subs.length === 0 && (
          <p className={styles.emptyWrapper}>No submissions yet</p>
        )}

        {!loading && subs.length > 0 && (
          <Accordion type="single" collapsible className="space-y-3">
            {subs.map((s, idx) => (
              <AccordionItem key={s._id} value={s._id} className="border-0">
                <div className="border border-border rounded-lg bg-[#1F1F1F] overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-[#1F1F1F]/80 w-full cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      {/* left block */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            #{subs.length - idx}
                          </span>
                          <div className="w-1 h-1 bg-white/60 rounded-full" />
                          <div className="flex items-center gap-1 text-sm text-white">
                            <FontAwesomeIcon
                              icon={faClock}
                              className="h-3 w-3"
                            />
                            {s.submittedAt
                              ? new Date(s.submittedAt).toLocaleString(
                                  "en-NZ",
                                  {
                                    timeZone: "Pacific/Auckland",
                                    day: "2-digit",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  },
                                )
                              : "—"}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md">
                          <FontAwesomeIcon icon={faCode} className="h-3 w-3" />
                          {s.language.toUpperCase()}
                        </div>
                      </div>
                      {/* verdict */}
                      <div
                        className={`flex items-center gap-2 font-medium text-sm ${verdictColor(s.verdict)}`}
                      >
                        {verdictIcon(s.verdict)}
                        {s.verdict}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-0 bg-[#1F1F1F]">
                    <div className="border-t border-border/30 pt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <FontAwesomeIcon
                          icon={faCode}
                          className="h-4 w-4 text-muted-foreground"
                        />
                        <span className="text-xs font-medium text-muted-foreground">
                          Source Code
                        </span>
                      </div>
                      <pre className="text-xs bg-background border border-[#2F2F2F] rounded-md p-3 overflow-x-auto whitespace-pre-wrap break-words font-mono">
                        {s.sourceCode}
                      </pre>
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}

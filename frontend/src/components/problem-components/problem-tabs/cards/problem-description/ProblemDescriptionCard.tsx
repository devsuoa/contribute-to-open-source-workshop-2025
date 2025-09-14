"use client";

import type React from "react";

import { useState, useEffect } from "react";
import styles from "./ProblemDescriptionCard.module.css";
import { useProblem } from "@/contexts/ProblemContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faLock } from "@fortawesome/free-solid-svg-icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useParams } from "react-router-dom";

interface ProblemProgress {
  problem: string;
  hintsUsed: number;
}

interface UserProgress {
  problems?: ProblemProgress[];
}

export default function ProblemDescriptionCard() {
  const { competitionId, problemId } = useParams<{
    competitionId: string;
    problemId: string;
  }>();
  const {
    problemName,
    problemDescription,
    sampleInput,
    constraints,
    problemHints,
    problemPoints,
    problemTag,
  } = useProblem();

  // State to track hints used count from API
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingUnlockIndex, setPendingUnlockIndex] = useState<number | null>(
    null,
  );

  const [cantUnlockDialogOpen, setCantUnlockDialogOpen] = useState(false);
  const [, setCantUnlockHintIndex] = useState<number | null>(null);

  // Fetch initial hints used count
  useEffect(() => {
    const fetchHintsUsed = async () => {
      if (!competitionId) {
        setLoading(false);
        return;
      }

      try {
        // First, ensure the user progress document exists
        await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/competitions/${competitionId}/progress`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user: "<USER_EMAIL>",
            }),
          },
        );

        // Then fetch the current progress
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/competitions/${competitionId}/progress/<USER_EMAIL>`,
        );

        if (response.ok) {
          const data: UserProgress = await response.json();
          // Find the problem progress for this specific problem
          const problemProgress = data.problems?.find(
            (p) => p.problem === problemId,
          );
          setHintsUsed(problemProgress?.hintsUsed || 0);
        } else if (response.status === 404) {
          // Progress not found, hintsUsed remains 0
          setHintsUsed(0);
        } else {
          console.error("Failed to fetch progress:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching hints used:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHintsUsed();
  }, [competitionId, problemId]);

  const handleHintClick = (hintIndex: number, event: React.MouseEvent) => {
    // Check if hint is already unlocked
    if (hintIndex < hintsUsed) {
      // Hint is already unlocked, allow normal accordion behavior
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    // Check if this hint can be unlocked (must be the next hint in sequence)
    const canUnlock = hintIndex === hintsUsed;

    if (canUnlock) {
      setPendingUnlockIndex(hintIndex);
      setDialogOpen(true);
    } else {
      setCantUnlockHintIndex(hintIndex);
      setCantUnlockDialogOpen(true);
    }
  };

  const handleUnlockConfirm = async () => {
    if (
      pendingUnlockIndex === null ||
      !competitionId ||
      !problemId
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/competitions/${competitionId}/progress/<USER_EMAIL>/hints`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            problem: problemId,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setHintsUsed(data.hintsUsed);
      } else {
        console.error("Failed to unlock hint:", response.statusText);
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error("Error unlocking hint:", error);
      // You might want to show an error message to the user here
    }

    setDialogOpen(false);
    setPendingUnlockIndex(null);
  };

  const handleUnlockCancel = () => {
    setDialogOpen(false);
    setPendingUnlockIndex(null);
  };

  const handleCantUnlockClose = () => {
    setCantUnlockDialogOpen(false);
    setCantUnlockHintIndex(null);
  };

  // Helper function to check if a hint is unlocked
  const isHintUnlocked = (hintIndex: number) => {
    return hintIndex < hintsUsed;
  };

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
          <>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-gray-400">Loading Hints...</div>
              </div>
            ) : (
              <Accordion type="multiple">
                {problemHints.map((hint, idx) => {
                  const id = `hint-${idx + 1}`;
                  const isUnlocked = isHintUnlocked(idx);

                  return (
                    <AccordionItem
                      key={id}
                      value={isUnlocked ? id : ""}
                      className="border-b border-[#2F2F2F] last:border-b-0"
                    >
                      {isUnlocked ? (
                        <AccordionTrigger className="flex justify-between items-center gap-2 cursor-pointer hover:no-underline py-4 [&[data-state=open]>svg]:rotate-0">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon
                              icon={faLightbulb}
                              className="text-yellow-400"
                            />
                            <span>Hint&nbsp;{idx + 1}</span>
                          </div>
                        </AccordionTrigger>
                      ) : (
                        <div
                          className="flex justify-between items-center gap-2 cursor-pointer hover:no-underline py-4 text-sm font-medium transition-all"
                          onClick={(e) => handleHintClick(idx, e)}
                        >
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon
                              icon={faLightbulb}
                              className="text-yellow-400"
                            />
                            <span>Hint&nbsp;{idx + 1}</span>
                          </div>
                          <FontAwesomeIcon
                            icon={faLock}
                            className="text-gray-400"
                          />
                        </div>
                      )}
                      {isUnlocked && (
                        <AccordionContent className="pb-4">
                          {hint}
                        </AccordionContent>
                      )}
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </>
        )}
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="border-[#2F2F2F]">
          <AlertDialogHeader>
            <AlertDialogTitle>Unlock Hint</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to unlock Hint{" "}
              {pendingUnlockIndex !== null ? pendingUnlockIndex + 1 : ""}? This
              action cannot be undone and will use one of your hints for this
              problem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleUnlockCancel}
              className="cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnlockConfirm}
              className="cursor-pointer"
            >
              Unlock
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={cantUnlockDialogOpen}
        onOpenChange={setCantUnlockDialogOpen}
      >
        <AlertDialogContent className="border-[#2F2F2F]">
          <AlertDialogHeader>
            <AlertDialogTitle>Cannot Unlock Hint</AlertDialogTitle>
            <AlertDialogDescription>
              You must unlock hints in sequential order. Please unlock Hint{" "}
              {hintsUsed + 1} first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={handleCantUnlockClose}
              className="cursor-pointer"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

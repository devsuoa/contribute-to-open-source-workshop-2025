import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./TopicGuideStyles.module.css";

interface TopicState {
  fullTopic?: string;
}

interface GuideLayoutProps {
  /** Fallback heading if user refreshes or lands directly */
  defaultHeading: string;
  children: ReactNode;
}

export default function GuideLayout({
  defaultHeading,
  children,
}: GuideLayoutProps) {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: TopicState };

  const heading = state?.fullTopic ?? defaultHeading;

  return (
    <div className={styles.page}>
      {/* Header Row */}
      <div className={styles.titleRow}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} />
        </button>
        <h1 className={styles.heading}>{heading}</h1>
      </div>

      {/* Guide-specific content */}
      <div className={styles.content}>{children}</div>
    </div>
  );
}

import StatusBarCompetition from "@/components/shared-components/status-bar-competition/StatusBarCompetition";
import { Outlet } from "react-router-dom";
import styles from "./CompetitionLayout.module.css";

const CompetitionLayout = () => (
  <div className={styles.page}>
    <div className={styles.statusBar}>
      <StatusBarCompetition />
    </div>
    <Outlet />
  </div>
);

export default CompetitionLayout;

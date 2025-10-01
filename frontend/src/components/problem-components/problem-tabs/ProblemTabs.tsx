// ProblemTabs.tsx
import styles from "./ProblemTabs.module.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProblemDescriptionCard from "./cards/problem-description/ProblemDescriptionCard";
import ProblemTestsCard from "./cards/problem-tests/ProblemTestsCard";

import { useProblem } from "@/contexts/ProblemContext";
import ProblemSubmissionsCard from "./cards/problem-submissions/ProblemSubmissionsCard";

export function ProblemTabs() {
  const { activeTab, setActiveTab } = useProblem();

  return (
    <div className={styles.wrapper}>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className={styles.tabs}
      >
        <TabsList className={styles.tabsList}>
          <TabsTrigger value="problem" className={styles.tabsTrigger}>
            Problem
          </TabsTrigger>
          <TabsTrigger value="tests" className={styles.tabsTrigger}>
            Tests
          </TabsTrigger>
          <TabsTrigger value="submissions" className={styles.tabsTrigger}>
            Submissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="problem" className={styles.tabsContent}>
          <ProblemDescriptionCard />
        </TabsContent>
        <TabsContent value="tests" className={styles.tabsContent}>
          <ProblemTestsCard />
        </TabsContent>
        <TabsContent value="submissions" className={styles.tabsContent}>
          <ProblemSubmissionsCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

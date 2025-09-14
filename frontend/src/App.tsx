import { ThemeProvider } from "@/components/theme-provider";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "@/pages/home-page/HomePage";
import ProblemPage from "@/pages/problem-page/ProblemPage";

import "./app.css";
import CompetitionLayout from "./pages/competition-page/competition-layout/CompetitionLayout";
import CompetitionProblemSet from "@/pages/competition-page/competition-problem-set/CompetitionProblemSet";
import CompetitionLeaderboard from "./pages/competition-page/competition-leaderboard/CompetitionLeaderboard";
import CompetitionDocumentation from "./pages/competition-page/competition-documentation/CompetitionDocumentation";
import TopicGuideRouter from "./router/TopicGuideRouter";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        {/* Public Routes*/}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Protected Routes*/}
        <Route
          path="/home"
          element={
            <HomePage />
          }
        />
        <Route
          path="/competition/:competitionId/*"
          element={
            <CompetitionLayout />
          }
        >
          <Route index element={<CompetitionProblemSet />} />
          <Route path="leaderboard" element={<CompetitionLeaderboard />} />
          <Route path="docs" element={<CompetitionDocumentation />} />
          <Route path="problem/:problemId" element={<ProblemPage />} />
          <Route path="topic/:topicSlug" element={<TopicGuideRouter />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;

import { ThemeProvider } from "@/components/theme-provider";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "@/pages/home-page/HomePage";
import ProblemPage from "@/pages/problem-page/ProblemPage";

import "./app.css";
import CompetitionLayout from "./pages/competition-page/competition-layout/CompetitionLayout";
import CompetitionProblemSet from "@/pages/competition-page/competition-problem-set/CompetitionProblemSet";
import CompetitionDocumentation from "./pages/competition-page/competition-documentation/CompetitionDocumentation";
import TopicGuideRouter from "./router/TopicGuideRouter";
import LoginPage from "./pages/login-page/LoginPage";
import RequireAuth from "./components/app-components/RequireAuth";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <UserProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          {/* Public Routes*/}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes*/}
          <Route
            path="/home"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path="/competition/:competitionId/*"
            element={
              <RequireAuth>
                <CompetitionLayout />
              </RequireAuth>
            }
          >
            <Route index element={<CompetitionProblemSet />} />
            {/* <Route path="leaderboard" element={<CompetitionLeaderboard />} /> */}
            <Route path="docs" element={<CompetitionDocumentation />} />
            <Route path="problem/:problemId" element={<ProblemPage />} />
            <Route path="topic/:topicSlug" element={<TopicGuideRouter />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;

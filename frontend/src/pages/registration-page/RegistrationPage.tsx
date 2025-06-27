import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import StatusBar from "@/components/shared-components/status-bar/StatusBar";
import type { User, YearLevel, Language } from "@/types/types";
import { YEAR_LEVELS, LANGUAGES } from "@/types/types";
import { toast } from "sonner";
import mascotGif from "@/assets/mascot-idle-animation.gif";

import styles from "./RegistrationPage.module.css";

const RegistrationPage = () => {
  const { state } = useLocation();
  const email = state?.email ?? "";
  const navigate = useNavigate();

  const [nick, setNick] = useState("");
  const [yearLevel, setYearLevel] = useState<YearLevel | "">("");
  const [preferredLanguage, setPreferredLanguage] = useState<Language | "">("");

  const handleSubmit = async () => {
    try {
      const user: User = {
        email,
        nick,
        yearLevel: yearLevel as YearLevel,
        preferredLanguage: preferredLanguage as Language,
      };

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users`, user);
      navigate("/home");
    } catch (err: unknown) {
      console.error("Registration failed:", err);
      let message = "Registration failed. Please try again.";
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        message = err.response.data.error;
      }
      toast.error(message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.statusBarWrap}>
        <StatusBar />
      </div>

      <div className={styles.mascotWrap}>
        <img
          src={mascotGif}
          alt="Mascot animation"
          className={styles.mascotImg}
        />
      </div>

      <div className={styles.formWrap}>
        <h2 className={styles.heading}>Complete Your Profile</h2>

        <Input
          placeholder="Username"
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          className={styles.input}
        />

        <Select onValueChange={(v: YearLevel) => setYearLevel(v)}>
          <SelectTrigger className={styles.selectTrigger}>
            <SelectValue placeholder="Select Year Level" />
          </SelectTrigger>
          <SelectContent className={styles.selectContent}>
            {YEAR_LEVELS.map((level) => (
              <SelectItem key={level} value={level} className="cursor-pointer">
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(v: Language) => setPreferredLanguage(v)}>
          <SelectTrigger className={styles.selectTrigger}>
            <SelectValue placeholder="Preferred Language" />
          </SelectTrigger>

          <SelectContent className={styles.selectContent}>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang} className="cursor-pointer">
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleSubmit} className={styles.submitBtn}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default RegistrationPage;

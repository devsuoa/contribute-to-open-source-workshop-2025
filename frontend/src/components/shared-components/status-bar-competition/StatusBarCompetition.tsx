import { NavLink, useParams } from "react-router-dom";
import styles from "./StatusBarCompetition.module.css";
import Logo from "@/assets/logo-white-text.svg";
import placeholder from "@/assets/avatar-placeholder.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faBook,
  faStar,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { signOut, getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/contexts/UserContext";

const linkClasses =
  "flex items-center gap-2 px-3 py-1 rounded-md font-medium hover:bg-muted transition-colors";
const activeClasses = "bg-muted";

const pillClasses =
  "flex items-center gap-2 px-3 py-2 rounded-md border border-[#2F2F2F] text-sm font-medium";

const StatusBarCompetition = () => {
  const { competitionId } = useParams();
  const { userId } = useUser();
  const avatarSrc = placeholder;

  const [points, setPoints] = useState<number | null>(null);
  const [countdown, setCountdown] = useState("--:--:--");

  /* Fetch points & set live countdown */
  useEffect(() => {
    const handler = (e: Event) => {
      setPoints((prev) => (prev ?? 0) + (e as CustomEvent<number>).detail);
    };
    window.addEventListener("points:add", handler);
    return () => window.removeEventListener("points:add", handler);
  }, []);

  useEffect(() => {
    if (!competitionId) return;

    let intervalId: ReturnType<typeof setInterval> | undefined;

    const init = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/competitions/${competitionId}?user=${userId}`,
        );
        setPoints(typeof data.points === "number" ? data.points : 0);

        const end = new Date(data.endTime).getTime();
        const tick = () => {
          const ms = end - Date.now();
          if (ms <= 0) {
            setCountdown("00:00:00");
            clearInterval(intervalId);
            return;
          }
          const h = Math.floor(ms / 3_600_000)
            .toString()
            .padStart(2, "0");
          const m = Math.floor((ms % 3_600_000) / 60_000)
            .toString()
            .padStart(2, "0");
          const s = Math.floor((ms % 60_000) / 1_000)
            .toString()
            .padStart(2, "0");
          setCountdown(`${h}:${m}:${s}`);
        };

        tick(); // Immediate update
        intervalId = setInterval(tick, 1_000);
      } catch (err) {
        console.error("❌ Failed to load competition bar data:", err);
      }
    };

    init();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [competitionId, userId]);

  return (
    <div className={styles.statusBar}>
      {/* Left: Logo & Navigation */}
      <div className="flex items-center justify-center gap-5">
        <img src={Logo} alt="Logo" className={styles.logo} />

        {/* Centre: Nav Links */}
        <nav className="flex items-center gap-2">
          <NavLink
            end
            to={`/competition/${competitionId}`}
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : ""}`
            }
          >
            <FontAwesomeIcon
              icon={faClipboardList}
              className="text-emerald-400"
            />
            Problem&nbsp;Set
          </NavLink>

          {/* <NavLink
            to={`/competition/${competitionId}/leaderboard`}
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : ""}`
            }
          >
            <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
            Leaderboard
          </NavLink> */}

          <NavLink
            to={`/docs`}
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : ""}`
            }
          >
            <FontAwesomeIcon icon={faBook} className="text-sky-400" />
            Documentation
          </NavLink>
        </nav>
      </div>

      {/* Right: Points, Countdown, Avatar */}
      <div className="flex gap-5">
        <div className="hidden sm:flex items-center gap-2">
          <span className={pillClasses}>
            <FontAwesomeIcon icon={faStar} className="text-amber-400" />
            <span className="sr-only">Points:</span>
            <span className="font-semibold text-white">{points ?? "--"}</span>
          </span>

          <span className={pillClasses}>
            <FontAwesomeIcon icon={faClock} className="text-[#808CF8]" />
            <span className="sr-only">Ends in:</span>
            <span
              className="font-semibold text-white font-mono
              [font-variant-numeric:tabular-nums] inline-block
              text-right min-w-[9ch] pr-0.5 whitespace-nowrap"
            >
              {countdown}
            </span>
          </span>
        </div>

        {/* Avatar + Dropdown */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <img src={avatarSrc} className={styles.avatar} />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className={styles.menuContent}>
            <DropdownMenuItem onSelect={() => console.log("Edit account")}>
              Edit&nbsp;account
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={async () => {
                await signOut(getAuth());
                window.location.href = "/login";
              }}
            >
              Sign&nbsp;out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default StatusBarCompetition;

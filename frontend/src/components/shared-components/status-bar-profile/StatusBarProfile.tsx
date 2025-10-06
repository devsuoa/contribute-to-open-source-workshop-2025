import { NavLink, useNavigate } from "react-router-dom";
import styles from "./StatusBarProfile.module.css";
import Logo from "@/assets/logo-white-text.svg";
import { signOut, getAuth } from "firebase/auth";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import placeholder from "@/assets/avatar-placeholder.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";

const linkClasses = "flex items-center gap-2 px-3 py-1 rounded-md font-medium hover:bg-muted transition-colors";
const activeClasses = "bg-muted";

const StatusBarProfile = () => {
  const avatarSrc = placeholder;
  const navigate = useNavigate();

  return (
    <div className={styles.statusBar}>
      <div className="flex">
        {/* Logo */}
        <img src={Logo} alt="Statusbar Logo" className={styles.logo} />

        {/* Centre: Nav Links */}
        <nav className="flex items-center gap-2">
          <NavLink to={`/docs`} className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ""}`}>
            <FontAwesomeIcon icon={faBook} className="text-sky-400" />
            Documentation
          </NavLink>
        </nav>
      </div>

      {/* Avatar + Dropdown */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <img src={avatarSrc} className={styles.avatar} />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className={styles.menuContent}>
          <DropdownMenuItem className={styles.menuItem} onSelect={() => console.log("Edit account")}>
            Edit account
          </DropdownMenuItem>

          <DropdownMenuItem
            className={styles.menuItem}
            onSelect={async () => {
              await signOut(getAuth());
              navigate("/login");
            }}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default StatusBarProfile;

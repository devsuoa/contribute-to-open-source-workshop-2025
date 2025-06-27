import { useNavigate } from "react-router-dom";
import styles from "./StatusBarProfile.module.css";
import Logo from "@/assets/logo-white-text.svg";
import { useAuth } from "@/contexts/AuthContext";
import { signOut, getAuth } from "firebase/auth";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import placeholder from "@/assets/avatar-placeholder.png";

const StatusBarProfile = () => {
  const { firebaseUser } = useAuth();
  const avatarSrc = firebaseUser?.photoURL || placeholder;
  const navigate = useNavigate();

  return (
    <div className={styles.statusBar}>
      {/* Logo */}
      <img src={Logo} alt="Statusbar Logo" className={styles.logo} />

      {/* Avatar + Dropdown */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <img src={avatarSrc} className={styles.avatar} />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className={styles.menuContent}>
          <DropdownMenuItem
            className={styles.menuItem}
            onSelect={() => console.log("Edit account")}
          >
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

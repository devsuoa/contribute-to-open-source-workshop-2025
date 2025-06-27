import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "@/firebase";
import GoogleLogo from "@/assets/google-logo.svg";
import axios from "axios";
import styles from "./GoogleSignInButton.module.css";

const GoogleSignInButton = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const { user } = resultsFromGoogle;
      const email = user.email;

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users?email=${email}`,
      );

      if (res.data.exists) {
        navigate("/home");
      } else {
        navigate("/registration", { state: { email } });
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      className={styles.button}
    >
      <img src={GoogleLogo} alt="Google logo" className={styles.logo} />
      Sign in with Google
    </Button>
  );
};

export default GoogleSignInButton;

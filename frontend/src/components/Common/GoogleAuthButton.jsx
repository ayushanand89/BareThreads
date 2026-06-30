import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { googleLogin } from "../../redux/slices/authSlice";

// "Continue with Google" — dispatches googleLogin with the Google ID token.
// On success, the Login/Register page's existing `useEffect` (watching `user`)
// handles cart-merge + redirect, so nothing extra is needed here.
const GoogleAuthButton = () => {
  const dispatch = useDispatch();

  const handleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    const res = await dispatch(
      googleLogin({ credential: credentialResponse.credential })
    );
    if (googleLogin.rejected.match(res)) {
      toast.error(res.payload?.message || "Google sign-in failed.");
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px flex-1 bg-ink/10" />
        <span className="text-xs uppercase tracking-wider text-stone">or</span>
        <span className="h-px flex-1 bg-ink/10" />
      </div>
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() =>
            toast.error("Google sign-in was cancelled or failed.")
          }
          theme="outline"
          shape="rectangular"
          text="continue_with"
        />
      </div>
    </div>
  );
};

export default GoogleAuthButton;

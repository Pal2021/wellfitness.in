import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import AppButton from "../../../components/AppButton";
import { colors, typography } from "../../../theme";
import api from "../../../services/api";
import { auth } from "../../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Google Client ID for Google Sign-In
const GOOGLE_CLIENT_ID =
  "473083426303-lo1u95qd7ptter1pshqe3eaqqutbqgkl.apps.googleusercontent.com";

const FEATURES_MINI = [
  { emoji: "🏋️", text: "Track sets, reps & weights" },
  { emoji: "🏆", text: "Automatic PR detection" },
  { emoji: "📊", text: "Visual progress tracking" },
  { emoji: "📋", text: "Custom workout splits" },
];

export default function LoginPage() {
  const { login, loginWithToken } = useAuth();
  const navigate = useNavigate();

  const [method, setMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Firebase Phone Auth
  const confirmationResultRef = useRef(null);
  const recaptchaVerifierRef = useRef(null);

  const handleComplete = (user) => {
    navigate(user.onboardingComplete ? "/" : "/onboarding");
  };

  // ─── Setup invisible reCAPTCHA for Firebase Phone Auth ───
  const setupRecaptcha = () => {
    if (recaptchaVerifierRef.current) return;

    recaptchaVerifierRef.current = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved - will proceed with phone auth
        },
        "expired-callback": () => {
          setError("reCAPTCHA expired. Please try again.");
          recaptchaVerifierRef.current = null;
        },
      },
    );
  };

  // ─── Firebase Phone Auth: Send OTP via Firebase (real SMS) ───
  const handleSendMobileOTP = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setLoading(true);

    try {
      setupRecaptcha();
      const phoneNumber = "+91" + mobileNumber;
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifierRef.current,
      );
      confirmationResultRef.current = confirmation;
      setOtpSent(true);
      setSuccess("OTP sent to your mobile number via SMS!");
    } catch (e) {
      console.error("Firebase Phone Auth Error:", e);
      if (e.code === "auth/too-many-requests") {
        setError("Too many OTP requests. Please wait and try again.");
      } else if (e.code === "auth/invalid-phone-number") {
        setError("Invalid phone number format.");
      } else if (e.code === "auth/captcha-check-failed") {
        setError(
          "reCAPTCHA verification failed. Please refresh and try again.",
        );
        recaptchaVerifierRef.current = null;
      } else {
        setError(e.message || "Failed to send OTP");
      }
      // Reset recaptcha on error
      recaptchaVerifierRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  // ─── Firebase Phone Auth: Verify OTP → Get Firebase token → Send to backend ───
  const handleVerifyMobileOTP = async () => {
    if (otp.length < 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    if (!confirmationResultRef.current) {
      setError("Please request OTP first");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Verify OTP with Firebase
      const result = await confirmationResultRef.current.confirm(otp);
      const firebaseUser = result.user;

      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();

      // Send Firebase ID token to our backend for verification + JWT
      const r = await api.post("/auth/firebase/phone", {
        idToken: idToken,
        phone: mobileNumber,
      });

      const user = loginWithToken(r.data.data);
      handleComplete(user);
    } catch (e) {
      console.error("OTP Verification Error:", e);
      if (e.code === "auth/invalid-verification-code") {
        setError("Invalid OTP. Please check and try again.");
      } else if (e.code === "auth/code-expired") {
        setError("OTP expired. Please request a new one.");
      } else {
        setError(
          e.response?.data?.message || e.message || "OTP verification failed",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Email + Password Login ───
  const handleEmailLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      handleComplete(user);
    } catch (e) {
      setError(e.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ─── Google Sign-In Callback ───
  const handleGoogleCallback = useCallback(
    async (response) => {
      setError("");
      setLoading(true);
      try {
        const r = await api.post("/auth/google", {
          credential: response.credential,
        });
        const user = loginWithToken(r.data.data);
        handleComplete(user);
      } catch (e) {
        setError(e.response?.data?.message || "Google authentication failed");
      } finally {
        setLoading(false);
      }
    },
    [loginWithToken, navigate],
  );

  // ─── Load Google Identity Services ───
  useEffect(() => {
    if (method !== "google") return;
    const existingScript = document.getElementById("google-gis-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-gis-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => initGoogleSignIn();
      document.head.appendChild(script);
    } else {
      initGoogleSignIn();
    }
    function initGoogleSignIn() {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
        });
        const container = document.getElementById("google-signin-btn");
        if (container) {
          container.innerHTML = "";
          window.google.accounts.id.renderButton(container, {
            theme: "filled_black",
            size: "large",
            width: 320,
            text: "continue_with",
            shape: "pill",
          });
        }
      }
    }
  }, [method, handleGoogleCallback]);

  const inputStyle = {
    width: "100%",
    background: colors.BG_SECONDARY,
    border: `0.5px solid ${colors.BORDER_DEFAULT}`,
    borderRadius: 14,
    padding: "14px 16px",
    fontSize: 14,
    color: colors.TEXT_PRIMARY,
    outline: "none",
    marginBottom: 10,
    fontWeight: 600,
  };

  const tabStyle = (active) => ({
    flex: 1,
    padding: "10px 6px",
    textAlign: "center",
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 800,
    cursor: "pointer",
    transition: "all 0.2s",
    background: active ? colors.AMBER_DIM : colors.BG_TERTIARY,
    border: `1px solid ${active ? colors.AMBER : colors.BORDER_DEFAULT}`,
    color: active ? colors.AMBER : colors.TEXT_TERTIARY,
  });

  const resetState = () => {
    setOtpSent(false);
    setError("");
    setSuccess("");
    setOtp("");
    confirmationResultRef.current = null;
    recaptchaVerifierRef.current = null;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 24,
      }}
    >
      {/* Invisible reCAPTCHA container for Firebase Phone Auth */}
      <div id="recaptcha-container"></div>

      {/* Logo */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 28,
          animation: "fadeIn 0.4s ease",
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: -2,
            marginBottom: 2,
            background: `linear-gradient(135deg, ${colors.AMBER} 0%, #FFD700 50%, ${colors.AMBER} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Wellfitness
        </div>
        <div
          style={{
            fontSize: 11,
            color: colors.TEXT_TERTIARY,
            fontWeight: 700,
            letterSpacing: 1.5,
          }}
        >
          SMART GYM TRACKER
        </div>
      </div>

      {/* Mini Features */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
          marginBottom: 20,
          animation: "fadeIn 0.5s ease",
        }}
      >
        {FEATURES_MINI.map((f, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 10px",
              borderRadius: 10,
              background: colors.BG_SECONDARY,
              border: `0.5px solid ${colors.BORDER_DEFAULT}`,
            }}
          >
            <span style={{ fontSize: 14 }}>{f.emoji}</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: colors.TEXT_SECONDARY,
              }}
            >
              {f.text}
            </span>
          </div>
        ))}
      </div>

      {/* Login Method Tabs */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 14,
          animation: "fadeIn 0.5s ease",
        }}
      >
        <div
          onClick={() => {
            setMethod("email");
            resetState();
          }}
          style={tabStyle(method === "email")}
        >
          📧 Email
        </div>
        <div
          onClick={() => {
            setMethod("mobile");
            resetState();
          }}
          style={tabStyle(method === "mobile")}
        >
          📱 Mobile
        </div>
        <div
          onClick={() => {
            setMethod("google");
            resetState();
          }}
          style={tabStyle(method === "google")}
        >
          🔵 Google
        </div>
      </div>

      {/* Forms */}
      <div style={{ animation: "fadeIn 0.4s ease" }}>
        {error && (
          <div
            style={{
              background: colors.RED_DIM,
              border: `0.5px solid #F8717133`,
              borderRadius: 12,
              padding: "10px 14px",
              fontSize: 12,
              color: colors.RED,
              marginBottom: 14,
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}
        {success && !error && (
          <div
            style={{
              background: colors.GREEN_DIM,
              border: `0.5px solid #34D39933`,
              borderRadius: 12,
              padding: "10px 14px",
              fontSize: 12,
              color: colors.GREEN,
              marginBottom: 14,
              fontWeight: 600,
            }}
          >
            ✅ {success}
          </div>
        )}

        {/* ─── EMAIL + PASSWORD ─── */}
        {method === "email" && (
          <>
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: colors.TEXT_TERTIARY,
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              SIGN IN WITH EMAIL
            </div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
              style={inputStyle}
            />
            <AppButton
              label="Sign In"
              onClick={handleEmailLogin}
              loading={loading}
            />
          </>
        )}

        {/* ─── MOBILE OTP: ENTER NUMBER (Firebase) ─── */}
        {method === "mobile" && !otpSent && (
          <>
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: colors.TEXT_TERTIARY,
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              SIGN IN WITH MOBILE (OTP via SMS)
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              <div
                style={{
                  padding: "14px 12px",
                  borderRadius: 14,
                  background: colors.BG_SECONDARY,
                  border: `0.5px solid ${colors.BORDER_DEFAULT}`,
                  fontSize: 14,
                  fontWeight: 700,
                  color: colors.TEXT_SECONDARY,
                }}
              >
                +91
              </div>
              <input
                type="tel"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={(e) =>
                  setMobileNumber(
                    e.target.value.replace(/\D/g, "").slice(0, 10),
                  )
                }
                style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
              />
            </div>
            <AppButton
              label="Send OTP via SMS →"
              onClick={handleSendMobileOTP}
              loading={loading}
            />
            <div
              style={{
                textAlign: "center",
                marginTop: 8,
                fontSize: 10,
                color: colors.TEXT_TERTIARY,
              }}
            >
              🔥 Powered by Firebase — real SMS delivery
            </div>
          </>
        )}

        {/* ─── MOBILE OTP: VERIFY (Firebase) ─── */}
        {method === "mobile" && otpSent && (
          <>
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: colors.TEXT_TERTIARY,
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              VERIFY SMS OTP
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                marginBottom: 12,
                background: colors.GREEN_DIM,
                border: `0.5px solid #34D39933`,
                fontSize: 12,
                color: colors.GREEN,
                fontWeight: 600,
              }}
            >
              📱 SMS sent to +91 {mobileNumber}. Check your phone!
            </div>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength={6}
              style={{
                ...inputStyle,
                textAlign: "center",
                fontSize: 22,
                fontFamily: typography.FONT_MONO,
                fontWeight: 800,
                letterSpacing: 8,
              }}
            />
            <AppButton
              label="Verify OTP →"
              onClick={handleVerifyMobileOTP}
              loading={loading}
            />
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <span
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setSuccess("");
                  confirmationResultRef.current = null;
                  recaptchaVerifierRef.current = null;
                }}
                style={{
                  fontSize: 11,
                  color: colors.TEXT_TERTIARY,
                  cursor: "pointer",
                }}
              >
                ← Change number
              </span>
            </div>
          </>
        )}

        {/* ─── GOOGLE SIGN-IN ─── */}
        {method === "google" && (
          <>
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: colors.TEXT_TERTIARY,
                letterSpacing: 1,
                marginBottom: 12,
              }}
            >
              SIGN IN WITH GOOGLE
            </div>
            <div
              id="google-signin-btn"
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 12,
                minHeight: 44,
              }}
            ></div>
            {loading && (
              <div
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  color: colors.TEXT_TERTIARY,
                  marginBottom: 8,
                  animation: "pulse 1.5s infinite",
                }}
              >
                Authenticating with Google...
              </div>
            )}
            <div
              style={{
                textAlign: "center",
                padding: "10px 14px",
                borderRadius: 10,
                marginTop: 4,
                background: colors.BG_SECONDARY,
                border: `0.5px solid ${colors.BORDER_DEFAULT}`,
                fontSize: 11,
                color: colors.TEXT_TERTIARY,
                lineHeight: 1.5,
              }}
            >
              🔒 Google OAuth 2.0 — verified directly by Google
            </div>
          </>
        )}

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            margin: "18px 0 14px",
          }}
        >
          <div
            style={{ flex: 1, height: 0.5, background: colors.BORDER_DEFAULT }}
          />
          <span
            style={{
              fontSize: 10,
              color: colors.TEXT_TERTIARY,
              fontWeight: 700,
            }}
          >
            OR
          </span>
          <div
            style={{ flex: 1, height: 0.5, background: colors.BORDER_DEFAULT }}
          />
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: 13,
            color: colors.TEXT_SECONDARY,
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: colors.AMBER,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Sign Up
          </Link>
        </div>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <span
            onClick={() => navigate("/welcome")}
            style={{
              fontSize: 11,
              color: colors.TEXT_TERTIARY,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ← Back to home
          </span>
        </div>
      </div>
    </div>
  );
}

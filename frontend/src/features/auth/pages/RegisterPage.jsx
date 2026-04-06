import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import AppButton from "../../../components/AppButton";
import { colors } from "../../../theme";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");

    // Name validation
    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    // Email validation
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Please enter a valid email address (e.g. name@gmail.com)");
      return;
    }

    // Password validation
    if (!password) {
      setError("Please enter a password");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number");
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
      navigate("/onboarding");
    } catch (e) {
      setError(e.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

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

  const isEmailValid = email && EMAIL_REGEX.test(email.trim());

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
      <div
        style={{
          textAlign: "center",
          marginBottom: 40,
          animation: "fadeIn 0.5s ease",
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: -2,
            background: `linear-gradient(135deg, ${colors.AMBER} 0%, #FFD700 50%, ${colors.AMBER} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Wellfitness
        </div>
        <div
          style={{
            fontSize: 12,
            color: colors.TEXT_TERTIARY,
            letterSpacing: 1,
            fontWeight: 600,
          }}
        >
          CREATE YOUR ACCOUNT
        </div>
      </div>

      <div style={{ animation: "fadeIn 0.6s ease" }}>
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

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        {/* Email with validation indicator */}
        <div style={{ position: "relative" }}>
          <input
            type="email"
            placeholder="Email (e.g. name@gmail.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          {email.length > 0 && (
            <span
              style={{
                position: "absolute",
                right: 14,
                top: 14,
                fontSize: 14,
              }}
            >
              {isEmailValid ? "✅" : "❌"}
            </span>
          )}
        </div>
        {email && !isEmailValid && (
          <div
            style={{
              fontSize: 10,
              color: colors.RED,
              marginTop: -6,
              marginBottom: 8,
              fontWeight: 600,
              paddingLeft: 4,
            }}
          >
            Enter a valid email (e.g. yourname@gmail.com)
          </div>
        )}

        <input
          type="password"
          placeholder="Password (min. 6 chars, 1 uppercase, 1 number)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {/* Password strength indicator */}
        {password && (
          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: -6,
              marginBottom: 8,
              paddingLeft: 4,
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color:
                  password.length >= 6 ? colors.GREEN : colors.TEXT_TERTIARY,
              }}
            >
              {password.length >= 6 ? "✓" : "○"} 6+ chars
            </span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: /[A-Z]/.test(password)
                  ? colors.GREEN
                  : colors.TEXT_TERTIARY,
              }}
            >
              {/[A-Z]/.test(password) ? "✓" : "○"} Uppercase
            </span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: /[0-9]/.test(password)
                  ? colors.GREEN
                  : colors.TEXT_TERTIARY,
              }}
            >
              {/[0-9]/.test(password) ? "✓" : "○"} Number
            </span>
          </div>
        )}

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          style={inputStyle}
        />
        {confirmPassword && password !== confirmPassword && (
          <div
            style={{
              fontSize: 10,
              color: colors.RED,
              marginTop: -6,
              marginBottom: 8,
              fontWeight: 600,
              paddingLeft: 4,
            }}
          >
            Passwords do not match
          </div>
        )}

        <div style={{ marginTop: 8 }}>
          <AppButton
            label="Create Account"
            onClick={handleRegister}
            loading={loading}
          />
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 18,
            fontSize: 13,
            color: colors.TEXT_SECONDARY,
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: colors.AMBER,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Sign In
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

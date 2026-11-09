import React, { useState, useRef, useEffect } from 'react';

/**
 * 6-box robust OTP component
 * Features:
 * - Backspace handles retreating naturally
 * - Pasting 6 digits fills the whole array sequentially
 * - onChange fires when fully populated
 */
export default function OTPInput({ length = 6, onChange, error }) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    // Notify parent if all filled
    if (otp.every(char => char !== "")) {
      onChange(otp.join(""));
    } else {
      onChange(""); // Or leave it alone, but good practice to sync
    }
  }, [otp, onChange]);

  const handleChange = (e, index) => {
    let value = e.target.value;
    // Only allow single numeric character
    if (!/^[0-9]$/.test(value) && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (newOtp[index] !== "") {
        // Clear current
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Retreat to previous and clear
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, length).replace(/[^0-9]/g, "");
    if (!pasteData) return;

    const newOtp = [...otp];
    let focusIndex = 0;
    
    for (let i = 0; i < length; i++) {
      if (typeof pasteData[i] !== 'undefined') {
        newOtp[i] = pasteData[i];
        focusIndex = i;
      }
    }
    setOtp(newOtp);
    
    if (focusIndex < length - 1) {
      inputRefs.current[focusIndex + 1]?.focus();
    } else {
      inputRefs.current[length - 1]?.focus();
      inputRefs.current[length - 1]?.blur();
    }
  };

  return (
    <div style={styles.container}>
      {otp.map((value, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary)';
            e.target.style.boxShadow = '0 0 0 2px rgba(245,165,36,0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
            e.target.style.boxShadow = 'none';
          }}
          style={{
            ...styles.box,
            borderColor: error ? 'var(--color-error)' : 'var(--color-border)',
          }}
        />
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    margin: '8px 0',
  },
  box: {
    width: '46px',
    height: '56px',
    textAlign: 'center',
    fontSize: '24px',
    fontFamily: 'var(--font-sans)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-text-primary)',
    backgroundColor: 'var(--color-bg-input)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 200ms ease',
    // Mobile responsive slightly tighter
    '@media (max-width: 360px)': {
      width: '40px',
      height: '50px',
    }
  }
};

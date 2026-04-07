import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// ─── FIXED: import AuthProvider not AuthContext ───
import { AuthProvider } from "../context/AuthContext";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import AppButton from "../components/AppButton";
import BottomNav from "../components/BottomNav";

// ─── Wrapper ──────────────────────────────────────
const Wrapper = ({ children }) => (
  <AuthProvider>
    <MemoryRouter>{children}</MemoryRouter>
  </AuthProvider>
);

// ─── Auth Pages Tests ─────────────────────────────
describe("Auth Pages Smoke Test", () => {
  it("LoginPage should render without crashing", () => {
    const { container } = render(
      <Wrapper>
        <LoginPage />
      </Wrapper>,
    );
    expect(container).toBeTruthy();
  });

  it("RegisterPage should render without crashing", () => {
    const { container } = render(
      <Wrapper>
        <RegisterPage />
      </Wrapper>,
    );
    expect(container).toBeTruthy();
  });
});

// ─── Common Components Tests ──────────────────────
describe("Common Components Smoke Test", () => {
  it("AppButton should render without crashing", () => {
    const { container } = render(<AppButton />);
    expect(container).toBeTruthy();
  });

  it("BottomNav should render without crashing", () => {
    const { container } = render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>,
    );
    expect(container).toBeTruthy();
  });
});

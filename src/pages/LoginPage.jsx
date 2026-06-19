import React, { useState, useId } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  LogIn,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const emailId = useId();
  const pwdId = useId();
  const rememberId = useId();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f6",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 380 }}>
        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#1a56db",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            {/* UBA logo mark */}
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <rect
                x="6"
                y="6"
                width="10"
                height="22"
                rx="2.5"
                fill="white"
                opacity=".95"
              />
              <rect
                x="18"
                y="6"
                width="10"
                height="10"
                rx="2.5"
                fill="white"
                opacity=".7"
              />
              <rect
                x="18"
                y="18"
                width="10"
                height="10"
                rx="2.5"
                fill="white"
                opacity=".5"
              />
            </svg>
          </div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#111827",
              margin: 0,
            }}
          >
            UBA Bot Dashboard
          </h1>
          <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
            Connectez-vous pour accéder au panneau
          </p>
        </div>

        {/* ── Secure badge ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontSize: 12,
            color: "#6B7280",
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            padding: "5px 12px",
            width: "fit-content",
            margin: "0 auto 1.25rem",
          }}
        >
          <ShieldCheck size={13} style={{ color: "#1a56db" }} />
          Connexion sécurisée — UBA Internal
        </div>

        {/* ── Card ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #E5E7EB",
            padding: "1.5rem",
            boxShadow: "0 1px 4px rgba(0,0,0,.06)",
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            {/* Error */}
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 8,
                  padding: "10px 12px",
                  marginBottom: "1rem",
                  fontSize: 13,
                  color: "#B91C1C",
                }}
                role="alert"
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor={emailId}
                style={{
                  display: "block",
                  fontSize: 12,
                  color: "#6B7280",
                  marginBottom: 6,
                }}
              >
                Adresse email
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={15}
                  style={{
                    position: "absolute",
                    left: 11,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id={emailId}
                  type="email"
                  required
                  autoFocus
                  placeholder="admin@uba.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "9px 12px 9px 34px",
                    fontSize: 14,
                    borderRadius: 8,
                    border: "1px solid #D1D5DB",
                    outline: "none",
                    color: "#111827",
                    background: "#F9FAFB",
                    transition: "border-color .15s, box-shadow .15s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1a56db";
                    e.target.style.boxShadow = "0 0 0 3px rgba(26,86,219,.12)";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "#F9FAFB";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 0 }}>
              <label
                htmlFor={pwdId}
                style={{
                  display: "block",
                  fontSize: 12,
                  color: "#6B7280",
                  marginBottom: 6,
                }}
              >
                Mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  style={{
                    position: "absolute",
                    left: 11,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id={pwdId}
                  type={showPwd ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "9px 38px 9px 34px",
                    fontSize: 14,
                    borderRadius: 8,
                    border: "1px solid #D1D5DB",
                    outline: "none",
                    color: "#111827",
                    background: "#F9FAFB",
                    transition: "border-color .15s, box-shadow .15s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1a56db";
                    e.target.style.boxShadow = "0 0 0 3px rgba(26,86,219,.12)";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "#F9FAFB";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={
                    showPwd
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9CA3AF",
                    padding: 2,
                    display: "flex",
                  }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div
              style={{ height: 1, background: "#F3F4F6", margin: "1.25rem 0" }}
            />

            {/* Remember me */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: "1.25rem",
              }}
            >
              <input
                type="checkbox"
                id={rememberId}
                style={{
                  width: 15,
                  height: 15,
                  accentColor: "#1a56db",
                  cursor: "pointer",
                }}
              />
              <label
                htmlFor={rememberId}
                style={{ fontSize: 13, color: "#6B7280", cursor: "pointer" }}
              >
                Se souvenir de moi
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                background: loading ? "#93AAEF" : "#1a56db",
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "background .15s",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = "#1447c0";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = "#1a56db";
              }}
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    style={{ animation: "spin .7s linear infinite" }}
                  />{" "}
                  Connexion…
                </>
              ) : (
                <>
                  <LogIn size={16} /> Se connecter
                </>
              )}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "#9CA3AF",
            marginTop: "1.25rem",
          }}
        >
          UBA WhatsApp Bot &copy; {new Date().getFullYear()}
        </p>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

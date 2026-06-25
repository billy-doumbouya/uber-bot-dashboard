import React, { useState, useId } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import LoginForm from "../components/ui/loginForm";
import LoginHeader from "../components/ui/loginHeader";

// Sous-composants

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const emailId = useId();
  const pwdId = useId();
  const rememberId = useId();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      {/* ── Effets de lumière en arrière-plan (Aura / Glow) ── */}
      <div className="absolute top-0 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-[128px] pointer-events-none" />

      <div className="relative w-full max-w-md space-y-6">
        {/* ── Header ── */}
        <LoginHeader />

        {/* ── Secure Badge ── */}
        <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1 text-xs font-medium text-slate-400 backdrop-blur-md transition-colors hover:border-blue-500/30">
          <ShieldCheck size={13} className="text-blue-500 animate-pulse" />
          <span>Connexion sécurisée — UBA Internal</span>
        </div>

        {/* ── Main Card (Glassmorphism) ── */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
          <LoginForm
            form={form}
            setForm={setForm}
            error={error}
            loading={loading}
            handleSubmit={handleSubmit}
            emailId={emailId}
            pwdId={pwdId}
            rememberId={rememberId}
          />
        </div>

        {/* ── Footer ── */}
        <footer className="text-center text-xs tracking-wide text-slate-500">
          UBA WhatsApp Bot &copy; {new Date().getFullYear()} &bull; Tous droits
          réservés.
        </footer>
      </div>
    </div>
  );
}

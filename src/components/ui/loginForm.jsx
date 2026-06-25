import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  AlertCircle,
} from "lucide-react";

export default function LoginForm({
  form,
  setForm,
  error,
  loading,
  handleSubmit,
  emailId,
  pwdId,
  rememberId,
}) {
  const [showPwd, setShowPwd] = useState(false);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* ── Alert Error (Animated Entry) ── */}
      {error && (
        <div
          className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 animate-in fade-in slide-in-from-top-2 duration-200"
          role="alert"
        >
          <AlertCircle size={18} className="flex-shrink-0 text-red-400" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* ── Input Email ── */}
      <div className="space-y-1.5">
        <label
          htmlFor={emailId}
          className="text-xs font-semibold tracking-wider text-slate-400 uppercase"
        >
          Adresse email
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
            <Mail size={18} />
          </div>
          <input
            id={emailId}
            type="email"
            required
            autoFocus
            placeholder="admin@uba.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
            disabled={loading}
          />
        </div>
      </div>

      {/* ── Input Password ── */}
      <div className="space-y-1.5">
        <label
          htmlFor={pwdId}
          className="text-xs font-semibold tracking-wider text-slate-400 uppercase"
        >
          Mot de passe
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
            <Lock size={18} />
          </div>
          <input
            id={pwdId}
            type={showPwd ? "text" : "password"}
            required
            placeholder="••••••••"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-3 pl-11 pr-11 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            aria-label={
              showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"
            }
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* ── Checkbox Remember Me ── */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id={rememberId}
          className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-blue-600 accent-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
        />
        <label
          htmlFor={rememberId}
          className="select-none text-sm text-slate-400 hover:text-slate-300 cursor-pointer transition-colors"
        >
          Se souvenir de moi
        </label>
      </div>

      {/* ── Submit Button (Gradient + Hover Glow Effect) ── */}
      <button
        type="submit"
        disabled={loading}
        className="relative group w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-600/30 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50"
      >
        <div className="flex items-center justify-center gap-2">
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Connexion en cours…</span>
            </>
          ) : (
            <>
              <LogIn
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
              />
              <span>Se connecter</span>
            </>
          )}
        </div>
      </button>
    </form>
  );
}

import React from "react";

export default function LoginHeader() {
  return (
    <div className="text-center">
      {/* Container du Logo avec gradient animé et effet de survol */}
      <div className="group mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40">
        <svg
          className="h-9 w-9 transition-transform duration-500 group-hover:rotate-12"
          viewBox="0 0 34 34"
          fill="none"
        >
          <rect
            x="6"
            y="6"
            width="10"
            height="22"
            rx="2.5"
            fill="white"
            className="opacity-95"
          />
          <rect
            x="18"
            y="6"
            width="10"
            height="10"
            rx="2.5"
            fill="white"
            className="opacity-70"
          />
          <rect
            x="18"
            y="18"
            width="10"
            height="10"
            rx="2.5"
            fill="white"
            className="opacity-50"
          />
        </svg>
      </div>

      <h1 className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
        UBA Bot Dashboard
      </h1>
      <p className="mt-1.5 text-sm text-slate-400">
        Connectez-vous pour accéder au panneau de gestion
      </p>
    </div>
  );
}

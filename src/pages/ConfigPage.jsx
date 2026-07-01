// src/pages/ConfigPage.jsx — version complète mise à jour

import React, { useEffect, useState } from "react";
import api from "../services/api";

// src/pages/ConfigPage.jsx — ajout des 3 clés prix

const EDITABLE_KEYS = [
  {
    key: "welcome_message",
    label: "Message de bienvenue",
    type: "textarea",
    rows: 4,
    mono: true,
  },
  {
    key: "closing_message",
    label: "Message de clôture (après commande)",
    type: "textarea",
    rows: 4,
    mono: true,
  },
  { key: "bot_active", label: "Bot actif", type: "toggle" },
  { key: "notify_email", label: "Email de notification agence", type: "text" },
  { key: "form_url", label: "URL du formulaire client", type: "text" },
  { key: "price_visa_classic", label: "Prix Visa Classic", type: "text" },
  { key: "price_visa_gold", label: "Prix Visa Gold", type: "text" },
  { key: "price_visa_business", label: "Prix Visa Business", type: "text" },
  {
    key: "ai_system_prompt",
    label: "Prompt de l'assistant IA (personnalité, ton, instructions)",
    type: "textarea",
    rows: 12,
    mono: false,
    resizable: true,
  },
  {
    key: "ai_models_fallback",
    label: "Modèles Gemini (ordre de priorité, séparés par des virgules)",
    type: "text",
  },
];
function Toggle({ value, onChange }) {
  const active = value === "true";
  return (
    <button
      onClick={() => onChange(active ? "false" : "true")}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${active ? "bg-brand-600" : "bg-gray-300"}`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${active ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}

export default function ConfigPage() {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get("/config")
      .then((res) => {
        const flat = {};
        for (const [k, v] of Object.entries(res.data)) {
          flat[k] = v.value;
        }
        setConfig(flat);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function handleChange(key, value) {
    setConfig((c) => ({ ...c, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await api.put("/config", config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuration</h1>
          <p className="text-gray-500 text-sm">
            Personnaliser le comportement du bot
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving
            ? "Sauvegarde..."
            : saved
              ? "✅ Sauvegardé"
              : "💾 Sauvegarder"}
        </button>
      </div>

      <div className="card divide-y divide-gray-100">
        {EDITABLE_KEYS.map(({ key, label, type, rows, mono, resizable }) => (
          <div key={key} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <label className="label">{label}</label>
                {type === "toggle" ? (
                  <div className="flex items-center gap-3 mt-2">
                    <Toggle
                      value={config[key]}
                      onChange={(v) => handleChange(key, v)}
                    />
                    <span className="text-sm text-gray-600">
                      {config[key] === "true" ? "Actif" : "Inactif"}
                    </span>
                  </div>
                ) : type === "textarea" ? (
                  <textarea
                    className={`input mt-1 ${resizable ? "resize-y" : "resize-none"} ${mono ? "font-mono text-xs" : "text-sm"}`}
                    rows={rows || 3}
                    value={config[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    className="input mt-1"
                    value={config[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving
            ? "Sauvegarde..."
            : saved
              ? "✅ Sauvegardé"
              : "💾 Sauvegarder les modifications"}
        </button>
      </div>
    </div>
  );
}

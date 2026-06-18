import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../services/api";

export default function WhatsAppPage() {
  const [status, setStatus] = useState(null);
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    // Charger le statut initial
    api
      .get("/whatsapp/status")
      .then((res) => setStatus(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));

    // Écouter les événements temps réel
    const socket = io(
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
        "http://localhost:3001",
      {
        withCredentials: true,
      },
    );

    socket.on("whatsapp:qr", ({ qr }) => {
      setQr(qr);
      setStatus((s) => ({ ...s, connected: false }));
    });

    socket.on("whatsapp:status", ({ status: s }) => {
      if (s === "connected") {
        setQr(null);
        // Recharger le statut pour avoir le numéro
        api
          .get("/whatsapp/status")
          .then((res) => setStatus(res.data))
          .catch(() => {});
      } else {
        setStatus((s) => ({ ...s, connected: false }));
      }
    });

    return () => socket.disconnect();
  }, []);

  async function handleDisconnect() {
    if (!confirm("Voulez-vous vraiment déconnecter le compte WhatsApp ?"))
      return;
    setDisconnecting(true);
    try {
      await api.post("/whatsapp/logout");
      setStatus((s) => ({ ...s, connected: false }));
      setQr(null);
    } catch (err) {
      alert("Erreur lors de la déconnexion");
    } finally {
      setDisconnecting(false);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-5 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">WhatsApp</h1>
        <p className="text-gray-500 text-sm">
          Gérer la connexion du bot WhatsApp
        </p>
      </div>

      {/* Statut */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Statut de connexion</h2>
          <span
            className={`badge ${status?.connected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {status?.connected ? "🟢 Connecté" : "🔴 Déconnecté"}
          </span>
        </div>

        {status?.connected && (
          <div className="space-y-2 mb-4">
            {status.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>📱</span>
                <span className="font-medium">+{status.phone}</span>
              </div>
            )}
            {status.name && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>👤</span>
                <span>{status.name}</span>
              </div>
            )}
          </div>
        )}

        {status?.connected ? (
          <button
            onClick={handleDisconnect}
            disabled={disconnecting}
            className="btn-danger"
          >
            {disconnecting ? "Déconnexion..." : "🔌 Déconnecter le compte"}
          </button>
        ) : (
          <p className="text-sm text-gray-500">
            Scanner le QR code ci-dessous avec votre téléphone pour connecter
            WhatsApp.
          </p>
        )}
      </div>

      {/* QR Code */}
      {!status?.connected && (
        <div className="card p-5 text-center">
          <h2 className="font-semibold text-gray-900 mb-2">
            Scanner le QR Code
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Ouvrez WhatsApp → Appareils connectés → Connecter un appareil
          </p>
          {qr ? (
            <div className="inline-block p-3 bg-white border-2 border-gray-200 rounded-xl">
              <img
                src={qr}
                alt="QR Code WhatsApp"
                className="w-56 h-56 object-contain"
              />
            </div>
          ) : (
            <div className="w-56 h-56 mx-auto bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-3 text-gray-400">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-brand-600 rounded-full animate-spin" />
              <p className="text-sm">En attente du QR code...</p>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-3">
            Le QR code se rafraîchit automatiquement
          </p>
        </div>
      )}
    </div>
  );
}

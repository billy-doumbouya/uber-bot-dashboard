import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'PROCESSING', label: 'En cours', color: 'bg-blue-100 text-blue-800' },
  { value: 'DONE', label: 'Terminé', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Annulé', color: 'bg-red-100 text-red-800' },
]
const CARD_LABELS = {
  VISA_CLASSIC: 'Visa Classic',
  VISA_GOLD: 'Visa Gold',
  VISA_BUSINESS: 'Visa Business',
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || '—'}</p>
    </div>
  )
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(() => navigate('/orders'))
      .finally(() => setLoading(false))
  }, [id])

  async function changeStatus(status) {
    setSaving(true)
    try {
      const res = await api.patch(`/orders/${id}/status`, { status })
      setOrder(o => ({ ...o, status: res.data.status }))
    } catch (err) {
      alert('Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const current = STATUS_OPTIONS.find(s => s.value === order.status)

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/orders" className="btn-secondary px-2 py-1 text-sm">← Retour</Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{order.lastName} {order.firstName}</h1>
          <p className="text-xs text-gray-400">{order.id}</p>
        </div>
        <span className={`badge ml-auto ${current?.color}`}>{current?.label}</span>
      </div>

      {/* Infos client */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Informations client</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Prénom" value={order.firstName} />
          <Field label="Nom" value={order.lastName} />
          <Field label="Téléphone carte" value={order.phone} />
          <Field label="Email" value={order.email} />
          <Field label="Adresse" value={order.address} />
          <Field label="Type de carte" value={CARD_LABELS[order.cardType] || order.cardType} />
          <Field label="Date de commande" value={new Date(order.createdAt).toLocaleString('fr-FR')} />
        </div>
      </div>

      {/* Google Drive */}
      {order.driveFolderUrl && (
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-3">📁 Dossier Google Drive</h2>
          <a
            href={order.driveFolderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Ouvrir le dossier Drive ↗
          </a>
        </div>
      )}

      {/* Documents */}
      {order.documents?.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-3">📎 Documents ({order.documents.length})</h2>
          <div className="space-y-2">
            {order.documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                <div>
                  <p className="font-medium text-gray-900">{doc.fileName}</p>
                  <p className="text-xs text-gray-500">{doc.mimeType} · {doc.source}</p>
                </div>
                <span className="text-green-600 text-xs">✅ Drive</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Changer le statut */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Changer le statut</h2>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s.value}
              onClick={() => changeStatus(s.value)}
              disabled={saving || order.status === s.value}
              className={`btn ${order.status === s.value ? 'opacity-50 cursor-default' : ''} ${s.color} border border-transparent`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

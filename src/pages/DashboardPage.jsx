import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  DONE: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

const STATUS_LABELS = {
  PENDING: 'En attente',
  PROCESSING: 'En cours',
  DONE: 'Terminé',
  CANCELLED: 'Annulé',
}

function StatCard({ label, value, icon, color = 'bg-brand-50 text-brand-700' }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/stats')
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-0.5">Vue d'ensemble des activités du bot</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total commandes" value={stats?.orders?.total} icon="📋" />
        <StatCard label="En attente" value={stats?.orders?.pending} icon="⏳" color="bg-yellow-50 text-yellow-700" />
        <StatCard label="Terminées" value={stats?.orders?.done} icon="✅" color="bg-green-50 text-green-700" />
        <StatCard label="Conversations actives" value={stats?.conversations?.active} icon="💬" color="bg-purple-50 text-purple-700" />
      </div>

      {/* Répartition statuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Répartition des statuts</h2>
          <div className="space-y-3">
            {['PENDING', 'PROCESSING', 'DONE', 'CANCELLED'].map(status => {
              const count = stats?.orders?.[status.toLowerCase()] ?? 0
              const total = stats?.orders?.total || 1
              const pct = Math.round((count / total) * 100)
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`badge ${STATUS_COLORS[status]}`}>{STATUS_LABELS[status]}</span>
                    <span className="font-medium text-gray-700">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Commandes récentes */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Commandes récentes</h2>
            <Link to="/orders" className="text-sm text-brand-600 hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-2">
            {stats?.recentOrders?.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">Aucune commande</p>
            )}
            {stats?.recentOrders?.map(order => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div>
                  <p className="font-medium text-sm text-gray-900">{order.lastName} {order.firstName}</p>
                  <p className="text-xs text-gray-500">{order.cardType} · {new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <span className={`badge ${STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status]}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

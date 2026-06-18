import React, { useEffect, useState, useCallback } from 'react'
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
const CARD_LABELS = {
  VISA_CLASSIC: 'Visa Classic',
  VISA_GOLD: 'Visa Gold',
  VISA_BUSINESS: 'Visa Business',
}

export default function OrdersPage() {
  const [data, setData] = useState({ orders: [], total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 20 })
      if (search) params.set('search', search)
      if (status) params.set('status', status)
      const res = await api.get(`/orders?${params}`)
      setData(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search, status])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  // Reset page on filter change
  useEffect(() => { setPage(1) }, [search, status])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
        <p className="text-gray-500 text-sm">{data.total} commande{data.total !== 1 ? 's' : ''} au total</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          className="input flex-1"
          placeholder="Rechercher par nom, téléphone, email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="input w-full sm:w-44" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data.orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-2">📭</p>
            <p>Aucune commande trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Téléphone</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Carte</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {order.lastName} {order.firstName}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{order.phone}</td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{CARD_LABELS[order.cardType] || order.cardType}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status]}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/orders/${order.id}`} className="btn-secondary text-xs px-2 py-1">
                        Voir →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page} sur {data.totalPages}</p>
          <div className="flex gap-2">
            <button
              className="btn-secondary"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Précédent
            </button>
            <button
              className="btn-secondary"
              onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
            >
              Suivant →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

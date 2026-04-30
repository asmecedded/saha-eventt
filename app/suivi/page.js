"use client"
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function SuiviPage() {
  const [searchId, setSearchId] = useState("")
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchId.trim()) return

    setLoading(true)
    setError("")
    setReservation(null)

    // On recherche la réservation par son ID
    const { data, error: fetchError } = await supabase
      .from('reservations')
      .select('*, salles(nom)')
      .eq('id', searchId.trim())
      .single()

    if (fetchError || !data) {
      setError("Aucune réservation trouvée avec cet identifiant.")
    } else {
      setReservation(data)
    }
    
    setLoading(false)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Validé':
        return <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-200">✅ Validée</span>;
      case 'Refusé':
        return <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-red-100 text-red-800 border border-red-200">❌ Refusée</span>;
      default:
        return <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-amber-100 text-amber-800 border border-amber-200">⏳ En cours de traitement</span>;
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-600 to-indigo-700"></div>

      <div className="relative w-full max-w-2xl bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="mb-10 text-center">
          <span className="inline-block p-4 bg-blue-50 text-blue-600 rounded-2xl mb-4 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">Suivre ma réservation</h2>
          <p className="mt-3 text-slate-500 font-medium">Entrez votre numéro de réservation pour vérifier son statut.</p>
        </div>
        
        <form onSubmit={handleSearch} className="mb-10">
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Ex: 12" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-grow px-5 py-4 bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-2xl focus:ring-0 focus:border-blue-500 outline-none transition-all text-lg" 
            />
            <button 
              type="submit" 
              disabled={loading || !searchId.trim()}
              className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : 'Rechercher'}
            </button>
          </div>
          {error && <p className="mt-4 text-red-500 font-medium flex items-center gap-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{error}</p>}
        </form>

        {reservation && (
          <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">
              Détails de la réservation <span className="text-blue-600">#{reservation.id}</span>
            </h3>
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <span className="text-slate-500 font-medium">Statut Actuel</span>
                {getStatusBadge(reservation.statut)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider mb-1">Nom du client</p>
                  <p className="font-bold text-slate-900 text-lg">{reservation.nom_client}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider mb-1">Téléphone</p>
                  <p className="font-bold text-slate-900 text-lg">{reservation.telephone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider mb-1">Date de l'événement</p>
                  <p className="font-bold text-slate-900 text-lg">
                    {new Date(reservation.date_evenement).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}
                  </p>
                </div>
                {reservation.salles && (
                  <div>
                    <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider mb-1">Salle réservée</p>
                    <p className="font-bold text-slate-900 text-lg text-blue-600">{reservation.salles.nom}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

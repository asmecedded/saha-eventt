"use client"
import { supabase } from '../../lib/supabase'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'

function ReservationForm() {
  const searchParams = useSearchParams()
  const salleId = searchParams.get('salle')
  
  const [loading, setLoading] = useState(false)
  const [envoye, setEnvoye] = useState(false)
  const [reservationId, setReservationId] = useState(null)
  const [fileNameDisplay, setFileNameDisplay] = useState("")
  const [datesIndisponibles, setDatesIndisponibles] = useState([])

  useEffect(() => {
    if (salleId) {
      fetchDatesIndisponibles()
    }
  }, [salleId])

  async function fetchDatesIndisponibles() {
    const { data } = await supabase
      .from('reservations')
      .select('date_evenement')
      .eq('salle_id', salleId)
      .neq('statut', 'Refusé')
    
    if (data) {
      setDatesIndisponibles(data.map(d => d.date_evenement))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formData = new FormData(e.target)
    const selectedDate = formData.get('date')

    if (datesIndisponibles.includes(selectedDate)) {
      alert("Désolé, cette date est déjà réservée ou en attente de validation. Veuillez choisir une autre date.")
      return
    }

    setLoading(true)
    const file = formData.get('recu_ccp')
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`

    // 1. Upload du reçu CCP dans le Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('recus_ccp')
      .upload(fileName, file)

    if (uploadError) {
      alert("Erreur upload photo : " + uploadError.message)
      setLoading(false)
      return
    }

    // 2. Récupération du lien public de la photo
    const { data: { publicUrl } } = supabase.storage.from('recus_ccp').getPublicUrl(fileName)

    // 3. Enregistrement de la réservation dans la Table
    const { data: insertedData, error: dbError } = await supabase.from('reservations').insert([{
      nom_client: formData.get('nom'),
      telephone: formData.get('tel'),
      date_evenement: selectedDate,
      salle_id: salleId,
      recu_url: publicUrl,
      statut: 'en_attente'
    }]).select()

    if (dbError) {
      alert("Erreur base de données : " + dbError.message)
    } else {
      if (insertedData && insertedData.length > 0) {
        setReservationId(insertedData[0].id)
      }
      setEnvoye(true)
    }
    setLoading(false)
  }

  if (envoye) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="bg-white p-10 md:p-16 rounded-[2rem] shadow-2xl text-center max-w-xl border border-slate-100">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8">
            ✓
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Réservation Confirmée !</h1>
          <p className="text-slate-600 mb-6 text-lg leading-relaxed">
            Votre reçu a été transmis avec succès. Notre équipe va vérifier votre paiement et vous recontactera très prochainement.
          </p>
          
          {reservationId && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-10">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">Votre N° de Suivi</p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-3xl font-extrabold text-blue-600 tracking-wider font-mono">{reservationId}</p>
                <button 
                  onClick={() => navigator.clipboard.writeText(reservationId)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  title="Copier le numéro"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-3 font-medium">
                Conservez ce numéro précieusement. Vous en aurez besoin pour suivre l'état de votre réservation.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/suivi" className="inline-flex items-center justify-center px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-50 transition-all duration-300">
              Suivre ma réservation
            </a>
            <a href="/" className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1">
              Retourner à l'accueil
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center bg-fixed relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/20">
        <div className="mb-10 text-center">
          <span className="inline-block p-4 bg-blue-50 text-blue-600 rounded-2xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">Finaliser la réservation</h2>
          <p className="mt-2 text-slate-500 font-medium">Salle sélectionnée : <span className="text-blue-600 font-bold">#{salleId}</span></p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nom Complet</label>
              <input 
                name="nom" 
                placeholder="Ex: Mohamed Amine" 
                required 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Numéro de Téléphone</label>
              <input 
                name="tel" 
                placeholder="Ex: 0555 00 00 00" 
                required 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Date de l'Événement</label>
              <input 
                name="date" 
                type="date" 
                required 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
              />
              {datesIndisponibles.length > 0 && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                  <span className="font-semibold">⚠️ Dates indisponibles :</span> {datesIndisponibles.map(d => new Date(d).toLocaleDateString('fr-FR')).join(', ')}
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Preuve de Paiement (Reçu CCP)</label>
            <div className="relative group border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-center">
              <input 
                name="recu_ccp" 
                type="file" 
                accept="image/*" 
                required 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => setFileNameDisplay(e.target.files[0]?.name || "")}
              />
              <div className="pointer-events-none">
                <svg className="mx-auto h-12 w-12 text-slate-400 group-hover:text-blue-500 mb-4 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {fileNameDisplay ? (
                  <p className="text-sm font-medium text-blue-600">{fileNameDisplay}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-slate-600">Cliquez pour ajouter une photo</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG jusqu'à 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours...
              </>
            ) : 'Confirmer la réservation'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function ReservationPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[calc(100vh-80px)]"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <ReservationForm />
    </Suspense>
  )
}
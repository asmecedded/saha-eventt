import { supabase } from '../../../lib/supabase'

export default async function SalleDetailsPage({ params }) {
  const { id } = await params;

  // Fetch salle data
  const { data: salle, error } = await supabase
    .from('salles')
    .select('*')
    .eq('id', id)
    .single()

  // Fetch reserved dates to show availability
  const { data: reservations } = await supabase
    .from('reservations')
    .select('date_evenement, statut')
    .eq('salle_id', id)
    
  const datesIndisponibles = reservations ? reservations.filter(r => r.statut !== 'Refusé').map(r => r.date_evenement).sort() : []

  if (error || !salle) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Salle introuvable</h1>
        <p className="text-slate-500 mb-8">La salle que vous recherchez n'existe pas ou a été retirée.</p>
        <a href="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition">Retour à l'accueil</a>
      </div>
    )
  }

  // Parse equipements if it's a comma-separated string
  const equipementsList = salle.equipements ? salle.equipements.split(',').map(e => e.trim()) : [];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Image Section */}
      <div className="relative w-full h-[40vh] md:h-[60vh] bg-slate-900">
        <img 
          src={salle.image_url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1920&auto=format&fit=crop'} 
          alt={salle.nom}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-4">
            {salle.disponibilite === true || salle.disponibilite === 'Oui' || salle.disponibilite === 'Disponible' ? (
              <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-400/30 backdrop-blur-md rounded-full text-sm font-bold tracking-wide">
                DISPONIBLE
              </span>
            ) : null}
            <span className="px-3 py-1 bg-white/20 text-white backdrop-blur-md border border-white/30 rounded-full text-sm font-bold tracking-wide flex items-center gap-2">
              👥 {salle.capacite} personnes
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">{salle.nom}</h1>
          <p className="text-lg md:text-xl text-slate-200 flex items-center gap-2">
            📍 {salle.adresse || 'Algérie'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">📝</span>
                À propos de cette salle
              </h2>
              <div className="prose prose-lg prose-slate text-slate-600">
                {salle.description ? (
                  <p className="whitespace-pre-line leading-relaxed">{salle.description}</p>
                ) : (
                  <p className="italic opacity-75">Aucune description disponible pour cette salle.</p>
                )}
              </div>
            </section>

            {/* Equipements */}
            {equipementsList.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">✨</span>
                  Équipements & Services
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {equipementsList.map((eq, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-slate-700">{eq}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right Column: Reservation Card */}
          <div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl sticky top-28">
              <div className="mb-8">
                <p className="text-sm text-slate-500 font-semibold uppercase tracking-widest mb-2">Prix de location</p>
                <p className="text-4xl font-extrabold text-slate-900">
                  {salle.prix?.toLocaleString('fr-DZ')} <span className="text-xl text-slate-400 font-medium">DZD</span>
                </p>
                <p className="text-slate-500 text-sm mt-1">Par événement / jour</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-xl">👥</div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Capacité max</p>
                    <p className="font-bold text-slate-900">{salle.capacite} invités</p>
                  </div>
                </div>
                
                {salle.telephone && (
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-xl">📞</div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Contact direct</p>
                      <p className="font-bold text-slate-900">{salle.telephone}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton pour afficher les dates indisponibles */}
              <details className="mt-6 mb-8 group">
                <summary className="cursor-pointer bg-slate-100 text-slate-700 font-semibold py-3 px-5 rounded-2xl flex items-center justify-between hover:bg-slate-200 transition-all">
                  <span className="flex items-center gap-2">📅 Vérifier les disponibilités</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 mt-2 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-600 max-h-40 overflow-y-auto">
                  {datesIndisponibles.length > 0 ? (
                    <div>
                      <p className="font-semibold text-red-500 mb-2">⚠️ Ces dates sont déjà réservées :</p>
                      <ul className="grid grid-cols-2 gap-2">
                        {datesIndisponibles.map((date, idx) => (
                          <li key={idx} className="bg-white px-2 py-1 rounded border border-slate-200 text-center font-medium shadow-sm">
                            {new Date(date).toLocaleDateString('fr-FR')}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="font-semibold text-green-600 flex items-center gap-2">
                      <span>✅</span> Toutes les dates sont actuellement libres !
                    </p>
                  )}
                </div>
              </details>

              <a 
                href={`/reserver?salle=${salle.id}`} 
                className="w-full block text-center py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-blue-600/30 hover:-translate-y-1 text-lg"
              >
                Réserver cette salle
              </a>
              <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                Aucun paiement immédiat requis. Vous enverrez votre reçu CCP après confirmation de la date.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

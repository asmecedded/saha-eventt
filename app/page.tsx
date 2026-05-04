import { supabase } from '../lib/supabase'
import SearchBar from './components/SearchBar'

export default async function Home({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const searchTerm = params?.search?.toLowerCase() || '';

  // On récupère les données
  const { data: allSalles, error } = await supabase.from('salles').select('*').order('nom')

  // On filtre si une recherche est active (ville, ID ou nom)
  const salles = allSalles?.filter(salle =>
    !searchTerm ||
    salle.adresse?.toLowerCase().includes(searchTerm) ||
    salle.id?.toLowerCase().includes(searchTerm) ||
    salle.nom?.toLowerCase().includes(searchTerm)
  ) || []

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 shadow-sm">
          <p className="font-semibold text-lg mb-1">Erreur de connexion</p>
          <p className="text-sm opacity-80">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8 border border-blue-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Nouvelles salles disponibles
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
            Des lieux d'exception pour des <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              moments inoubliables
            </span>
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Trouvez et réservez facilement la salle parfaite pour votre mariage, conférence ou événement privé en Algérie avec Saha-Event.
          </p>

          {/* Barre de recherche par ID intégrée */}
          <SearchBar />
        </div>
      </section>

      {/* Salles Grid */}
      <section id="salles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Nos Salles Disponibles</h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {salles && salles.length > 0 ? (
            salles.map((salle) => (
              <div
                key={salle.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/60 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="relative h-64 overflow-hidden">
                  <a href={`/salle/${salle.id}`} className="block w-full h-full">
                    <img
                      src={salle.image_url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop'}
                      alt={salle.nom}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out cursor-pointer"
                    />
                  </a>
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-slate-800 shadow-sm border border-white/20">
                    👥 {salle.capacite} pers.
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <a href={`/salle/${salle.id}`} className="hover:text-blue-600 transition-colors">
                      <h3 className="text-2xl font-bold text-slate-900 line-clamp-1">{salle.nom}</h3>
                    </a>
                    {salle.disponibilite === true || salle.disponibilite === 'Oui' || salle.disponibilite === 'Disponible' ? (
                      <span className="shrink-0 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">Disponible</span>
                    ) : null}
                  </div>

                  <p className="text-slate-500 mb-2 flex items-center gap-2 text-sm font-medium">
                    <span className="text-blue-500 text-lg">📍</span> {salle.adresse || 'Algérie'}
                  </p>

                  {salle.telephone && (
                    <p className="text-slate-500 mb-8 flex items-center gap-2 text-sm font-medium">
                      <span className="text-blue-500 text-lg">📞</span> {salle.telephone}
                    </p>
                  )}

                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">À partir de</p>
                      <p className="font-extrabold text-slate-900 text-xl">
                        {salle.prix.toLocaleString('fr-DZ')} <span className="text-sm font-medium text-slate-500">DZD/J</span>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={`/salle/${salle.id}`}
                        className="inline-flex items-center justify-center px-4 py-3 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all duration-300"
                      >
                        Détails
                      </a>
                      <a
                        href={`/reserver?salle=${salle.id}`}
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-50 text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300"
                      >
                        Réserver
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-slate-200 border-dashed">
              <span className="text-5xl mb-6 block">🔍</span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Aucune salle trouvée</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                Nous n'avons trouvé aucune salle correspondant à "{searchTerm}".
              </p>
              <a href="/" className="inline-block px-6 py-3 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition">
                Voir toutes les salles
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
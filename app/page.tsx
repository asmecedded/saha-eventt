import { supabase } from '../lib/supabase'

export default async function Home() {
  // On récupère les données
  const { data: salles, error } = await supabase.from('salles').select('*')

  if (error) return <div style={{padding: '50px', color: 'red'}}>Erreur : {error.message}</div>
  
  return (
    <main style={{ padding: '40px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ color: '#1e3a8a', textAlign: 'center', marginBottom: '40px' }}>⭐ Saha-Event : Nos Salles d'Exception ⭐</h1>
      
      {/* Conteneur de la grille */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {salles && salles.length > 0 ? (
          salles.map((salle) => (
            <div key={salle.id} style={{ 
              backgroundColor: 'white', 
              border: '1px solid #eee', 
              padding: '0', 
              borderRadius: '20px', 
              overflow: 'hidden',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}>
              {/* Image de la salle */}
              <img 
                src={salle.image_url || 'https://via.placeholder.com/400x250?text=Pas+d+image'} 
                alt={salle.nom} 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
              />
              
              <div style={{ padding: '20px' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#111827' }}>{salle.nom}</h2>
                <p style={{ color: '#6b7280', marginBottom: '15px' }}>📍 {salle.adresse}</p>
                
                {/* Affichage de la CAPACITÉ */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ backgroundColor: '#f3f4f6', padding: '5px 12px', borderRadius: '20px', fontSize: '0.9rem', color: '#374151' }}>
                    👥 Capacité : <strong>{salle.capacite || 'N/A'} personnes</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontWeight: 'bold', color: '#059669', fontSize: '1.4rem', margin: '0' }}>
                    {salle.prix_journalier} <small style={{fontSize: '0.8rem'}}>DZD/J</small>
                  </p>
                  <button style={{ 
                    backgroundColor: '#2563eb', 
                    color: 'white', 
                    border: 'none', 
                    padding: '10px 15px', 
                    borderRadius: '10px', 
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                    Réserver
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>Chargement des salles...</p>
        )}
      </div>
    </main>
  )
}
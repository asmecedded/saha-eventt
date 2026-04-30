"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      // Redirige vers la page d'accueil avec le paramètre de recherche
      router.push(`/?search=${encodeURIComponent(search.trim())}#salles`)
    } else {
      router.push(`/#salles`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-8 mb-4 relative">
      <div className="relative flex items-center w-full h-16 rounded-full focus-within:shadow-lg bg-white border border-slate-200 overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg">
        <div className="grid place-items-center h-full w-16 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          className="peer h-full w-full outline-none text-slate-700 text-lg bg-transparent pr-4"
          type="text"
          id="search"
          placeholder="Rechercher par wilaya, nom ou ID (ex: Oran, ORN...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <button 
          type="submit"
          className="h-12 px-6 m-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors duration-300 flex items-center gap-2"
        >
          <span>Rechercher</span>
        </button>
      </div>
      <p className="text-sm text-slate-500 mt-4 text-center">
        Recherchez une ville (Alger, Oran) ou utilisez un code (ALG, ORN) pour filtrer les salles.
      </p>
    </form>
  )
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saha-Event | Réservation de Salles d'Exception",
  description: "Réservez les meilleures salles pour vos événements en Algérie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-slate-50`}
    >
      <body className="min-h-full flex flex-col font-sans text-slate-900">
        {/* Navbar Premium */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-2">
                <span className="text-3xl">✨</span>
                <a href="/" className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
                  Saha-Event
                </a>
              </div>
              <div className="hidden md:flex space-x-8">
                <a href="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Accueil</a>
                <a href="/#salles" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Nos Salles</a>
                <a href="/suivi" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Suivi Réservation</a>
                <a href="#contact" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Contact</a>
              </div>
              <div className="flex items-center gap-4">
                <a href="/admin" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Espace Admin</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Contenu Principal */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        {/* Footer Premium */}
        <footer id="contact" className="bg-slate-900 text-slate-300 py-12 mt-auto border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✨</span>
                <span className="font-bold text-xl text-white">Saha-Event</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                La plateforme n°1 de réservation de salles des fêtes et d'événements en Algérie.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Liens Utiles</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-blue-400 transition-colors">Accueil</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Comment ça marche ?</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Conditions Générales</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>📍 Amizour, Béjaïa</li>
                <li>📧 contact@saha-event.dz</li>
                <li>📞 +213 555 00 00 00</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Saha-Event. Tous droits réservés.
          </div>
        </footer>
      </body>
    </html>
  );
}

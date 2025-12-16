'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';
import { Music, Sparkles, TrendingUp, Mic2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Círculos de fondo animados */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Logo y título */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 animate-bounce shadow-2xl">
            <Music className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Spotify <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Taste Mixer</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Crea playlists personalizadas con IA
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Personalización Total</h3>
            <p className="text-gray-400 text-sm">Selecciona artistas, géneros y décadas favoritas</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Descubre Nueva Música</h3>
            <p className="text-gray-400 text-sm">Algoritmos inteligentes para encontrar joyas ocultas</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <Mic2 className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Tu Gusto Musical</h3>
            <p className="text-gray-400 text-sm">Controla el mood, energía y popularidad</p>
          </div>
        </div>

        {/* Botón de Login */}
        <div className="text-center">
          <button
            onClick={handleLogin}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-5 px-12 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/50"
          >
            <Music className="w-6 h-6 animate-pulse" />
            <span>Conectar con Spotify</span>
            <svg 
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          
          <p className="text-gray-400 text-sm mt-6">
            Necesitas una cuenta de Spotify para continuar
          </p>
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center space-y-3">
          <div className="flex items-center justify-center gap-8 text-gray-400 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              100% Gratis
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              Sin Anuncios
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
              Playlists Ilimitadas
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
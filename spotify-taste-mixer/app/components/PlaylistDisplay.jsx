'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Plus, Save } from 'lucide-react';
import TrackCard from './TrackCard';

export default function PlaylistDisplay({ playlist, onRemoveTrack, onRefresh, onAddMore }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Cargar favoritos desde localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('favorite_tracks');
      if (stored) {
        try {
          setFavorites(JSON.parse(stored));
        } catch (error) {
          console.error('Error cargando favoritos:', error);
          setFavorites([]);
        }
      }
    }
  }, []);

  const toggleFavorite = (track) => {
    const isFav = favorites.find(f => f.id === track.id);
    let updated;
    
    if (isFav) {
      updated = favorites.filter(f => f.id !== track.id);
    } else {
      updated = [...favorites, track];
    }
    
    setFavorites(updated);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorite_tracks', JSON.stringify(updated));
    }
  };

  const getTotalDuration = () => {
    // Calcular duración total (suponiendo 3:30 por canción)
    const totalSeconds = playlist.length * 210; // 3.5 minutos promedio
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Tu Playlist Personalizada</h2>
          <p className="text-gray-400">
            {playlist.length} canciones · {favorites.length} favoritas · ~{getTotalDuration()}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
            title="Regenerar playlist con las mismas preferencias"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refrescar</span>
          </button>
          <button
            onClick={onAddMore}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
            title="Añadir más canciones a la playlist"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Añadir Más</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">Total</p>
          <p className="text-white text-xl font-bold">{playlist.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">Favoritas</p>
          <p className="text-red-400 text-xl font-bold">{favorites.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">Duración</p>
          <p className="text-white text-xl font-bold">~{getTotalDuration()}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">Estado</p>
          <p className="text-green-400 text-xl font-bold">✓ Lista</p>
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {playlist.map((track, index) => (
          <TrackCard
            key={track.id}
            track={track}
            index={index + 1}
            onRemove={onRemoveTrack}
            onToggleFavorite={toggleFavorite}
            isFavorite={!!favorites.find(f => f.id === track.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {playlist.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-gray-400 text-lg">No hay canciones en la playlist</p>
          <p className="text-gray-500 text-sm mt-2">Haz clic en "Generar Playlist" para empezar</p>
        </div>
      )}

      {/* Footer Actions */}
      {playlist.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col sm:flex-row gap-3">
          <button
            className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg transition"
            onClick={() => {
              if (confirm('¿Limpiar toda la playlist?')) {
                playlist.forEach(track => onRemoveTrack(track.id));
              }
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Limpiar Playlist
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg transition"
            onClick={() => alert('Funcionalidad de guardar en Spotify próximamente...')}
          >
            <Save className="w-4 h-4" />
            Guardar en Spotify
          </button>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
}
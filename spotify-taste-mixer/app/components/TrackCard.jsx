'use client';

import { Heart, X, Play, MoreVertical } from 'lucide-react';
import { useState } from 'react';

export default function TrackCard({ track, index, onRemove, onToggleFavorite, isFavorite }) {
  const [showMenu, setShowMenu] = useState(false);

  const formatDuration = (duration) => {
    // Si viene en formato "3:45", retornarlo tal cual
    if (typeof duration === 'string' && duration.includes(':')) {
      return duration;
    }
    
    // Si viene en milisegundos (de la API de Spotify)
    if (typeof duration === 'number') {
      const minutes = Math.floor(duration / 60000);
      const seconds = Math.floor((duration % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return '3:00';
  };

  return (
    <div className="group bg-gray-800 hover:bg-gray-700 rounded-lg p-3 flex items-center gap-4 transition-all duration-200">
      {/* Index Number */}
      <div className="text-gray-500 font-medium w-8 text-center group-hover:text-white transition-colors">
        {index}
      </div>

      {/* Album Art */}
      <div className="relative w-14 h-14 flex-shrink-0">
        {track.image ? (
          <img 
            src={track.image} 
            alt={track.name}
            className="w-full h-full object-cover rounded shadow-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center">
            <Play className="w-6 h-6 text-gray-500" />
          </div>
        )}
        
        {/* Play button overlay on hover */}
        <div className="absolute inset-0 bg-black/60 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold truncate group-hover:text-green-400 transition-colors">
          {track.name}
        </h4>
        <p className="text-gray-400 text-sm truncate">
          {track.artist}
        </p>
      </div>

      {/* Album Name (hidden on mobile) */}
      <div className="hidden lg:block flex-1 min-w-0">
        <p className="text-gray-400 text-sm truncate">
          {track.album || 'Single'}
        </p>
      </div>

      {/* Duration */}
      <div className="text-gray-400 text-sm w-16 text-right">
        {formatDuration(track.duration)}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(track);
          }}
          className={`p-2 rounded-full transition-all ${
            isFavorite 
              ? 'bg-red-600 text-white scale-110' 
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white opacity-0 group-hover:opacity-100'
          }`}
          title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Heart 
            className="w-4 h-4" 
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        </button>

        {/* Remove Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(track.id);
          }}
          className="p-2 bg-gray-700 rounded-full hover:bg-red-600 transition-all text-gray-400 hover:text-white opacity-0 group-hover:opacity-100"
          title="Eliminar de la playlist"
        >
          <X className="w-4 h-4" />
        </button>

        {/* More Options (Optional) */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-all text-gray-400 hover:text-white opacity-0 group-hover:opacity-100"
            title="Más opciones"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 w-48">
                <button
                  onClick={() => {
                    onToggleFavorite(track);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm text-white flex items-center gap-2 rounded-t-lg"
                >
                  <Heart className="w-4 h-4" />
                  {isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                </button>
                <button
                  onClick={() => {
                    alert('Añadir a cola próximamente...');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm text-white flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Añadir a cola
                </button>
                <button
                  onClick={() => {
                    onRemove(track.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm text-red-400 flex items-center gap-2 rounded-b-lg"
                >
                  <X className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}